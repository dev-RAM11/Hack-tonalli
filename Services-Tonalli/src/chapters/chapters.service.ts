import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { ChapterModule } from './entities/chapter-module.entity';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { User } from '../users/entities/user.entity';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chaptersRepo: Repository<Chapter>,
    @InjectRepository(ChapterModule)
    private readonly modulesRepo: Repository<ChapterModule>,
    @InjectRepository(ChapterProgress)
    private readonly progressRepo: Repository<ChapterProgress>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  // ── Admin CRUD ───────────────────────────────────────────────────────────

  async create(dto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chaptersRepo.create(dto);
    const saved = await this.chaptersRepo.save(chapter);

    // Auto-create 4 modules: 3 lesson modules + 1 final exam
    const modules = [
      { type: 'lesson' as const, order: 1, title: 'Módulo 1', questionsPerAttempt: 5, xpReward: 30 },
      { type: 'lesson' as const, order: 2, title: 'Módulo 2', questionsPerAttempt: 5, xpReward: 30 },
      { type: 'lesson' as const, order: 3, title: 'Módulo 3', questionsPerAttempt: 5, xpReward: 30 },
      { type: 'final_exam' as const, order: 4, title: 'Examen Final', questionsPerAttempt: 10, xpReward: 50 },
    ];

    for (const m of modules) {
      await this.modulesRepo.save(this.modulesRepo.create({
        chapterId: saved.id,
        type: m.type,
        order: m.order,
        title: m.title,
        passingScore: 80,
        questionsPerAttempt: m.questionsPerAttempt,
        xpReward: m.xpReward,
      }));
    }

    return this.findOne(saved.id);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  getCurrentWeek(): string {
    const now = new Date();
    const jan1 = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - jan1.getTime()) / 86400000);
    const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  }

  getNextWeek(): string {
    const now = new Date();
    const next = new Date(now.getTime() + 7 * 86400000);
    const jan1 = new Date(next.getFullYear(), 0, 1);
    const days = Math.floor((next.getTime() - jan1.getTime()) / 86400000);
    const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7);
    return `${next.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
  }

  // ── Find methods ────────────────────────────────────────────────────────

  async findAll(): Promise<Chapter[]> {
    return this.chaptersRepo.find({ relations: ['modules'], order: { order: 'ASC' } });
  }

  /** Admin: all published (no week filter) */
  async findAllPublished(): Promise<Chapter[]> {
    return this.chaptersRepo.find({ where: { published: true }, relations: ['modules'], order: { order: 'ASC' } });
  }

  /** User: published chapters filtered by week based on plan */
  async findPublishedForUser(userId: string): Promise<any[]> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    const allPublished = await this.chaptersRepo.find({
      where: { published: true },
      relations: ['modules'],
      order: { order: 'ASC' },
    });

    const currentWeek = this.getCurrentWeek();
    const nextWeek = this.getNextWeek();

    return allPublished.map((ch) => {
      // Determine if chapter is accessible based on releaseWeek
      let accessible = true;
      let reason = '';

      if (ch.releaseWeek) {
        if (user?.isPremium) {
          // Premium: can access current week + next week (2 chapters/week)
          accessible = ch.releaseWeek <= nextWeek;
          if (!accessible) reason = 'premium_future';
        } else {
          // Free: can only access chapters released this week or earlier
          accessible = ch.releaseWeek <= currentWeek;
          if (!accessible) reason = 'free_locked';
        }
      }
      // Chapters without releaseWeek are always accessible (no restriction)

      return {
        id: ch.id,
        title: ch.title,
        description: ch.description,
        moduleTag: ch.moduleTag,
        order: ch.order,
        published: ch.published,
        coverImage: ch.coverImage,
        estimatedMinutes: ch.estimatedMinutes,
        xpReward: ch.xpReward,
        releaseWeek: ch.releaseWeek,
        modules: ch.modules?.sort((a, b) => a.order - b.order),
        createdAt: ch.createdAt,
        updatedAt: ch.updatedAt,
        // Access control
        accessible,
        lockedReason: accessible ? null : reason,
        currentWeek,
      };
    });
  }

  async findOne(id: string): Promise<Chapter> {
    const ch = await this.chaptersRepo.findOne({ where: { id }, relations: ['modules'] });
    if (!ch) throw new NotFoundException(`Chapter ${id} not found`);
    if (ch.modules) ch.modules.sort((a, b) => a.order - b.order);
    return ch;
  }

  async update(id: string, dto: UpdateChapterDto): Promise<Chapter> {
    const ch = await this.findOne(id);
    Object.assign(ch, dto);
    return this.chaptersRepo.save(ch);
  }

  async remove(id: string): Promise<void> {
    await this.chaptersRepo.remove(await this.findOne(id));
  }

  async togglePublish(id: string): Promise<Chapter> {
    const ch = await this.findOne(id);
    ch.published = !ch.published;
    return this.chaptersRepo.save(ch);
  }

  /** Admin: set releaseWeek for a chapter (release it for a specific week) */
  async setReleaseWeek(id: string, week: string): Promise<Chapter> {
    const ch = await this.findOne(id);
    ch.releaseWeek = week;
    return this.chaptersRepo.save(ch);
  }

  /** Admin: release chapter for the current week */
  async releaseThisWeek(id: string): Promise<Chapter> {
    return this.setReleaseWeek(id, this.getCurrentWeek());
  }

  async updateModule(moduleId: string, data: Partial<ChapterModule>): Promise<ChapterModule> {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');
    Object.assign(mod, data);
    return this.modulesRepo.save(mod);
  }

  // ── User: chapter with progress ─────────────────────────────────────────

  async getChapterWithProgress(chapterId: string, userId: string) {
    const chapter = await this.findOne(chapterId);
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    // Check week-based access
    let chapterAccessible = true;
    let lockedReason: string | null = null;
    if (chapter.releaseWeek) {
      const currentWeek = this.getCurrentWeek();
      const nextWeek = this.getNextWeek();
      if (user?.isPremium) {
        chapterAccessible = chapter.releaseWeek <= nextWeek;
        if (!chapterAccessible) lockedReason = 'Este capitulo se libera en una semana futura.';
      } else {
        chapterAccessible = chapter.releaseWeek <= currentWeek;
        if (!chapterAccessible) lockedReason = 'Este capitulo aun no esta disponible para tu plan. Se libera la semana ' + chapter.releaseWeek + '.';
      }
    }

    const allProgress = await this.progressRepo.find({ where: { chapterId, userId } });
    const progressMap = new Map(allProgress.map((p) => [p.moduleId, p]));

    let prevModuleCompleted = true;
    const modulesData = chapter.modules.map((mod) => {
      const progress = progressMap.get(mod.id);
      const isLesson = mod.type === 'lesson';

      // Unlock logic
      let unlocked = false;
      if (mod.order === 1) {
        unlocked = true;
      } else if (mod.order <= 3) {
        unlocked = prevModuleCompleted;
      } else {
        // Module 4 (final exam): needs mod 3 completed + (premium or paid)
        const mod3 = chapter.modules.find((m) => m.order === 3);
        const mod3Progress = mod3 ? progressMap.get(mod3.id) : null;
        const mod3Done = !!mod3Progress?.completed;
        unlocked = mod3Done && (user?.isPremium || !!progress);
      }

      // Lives for quiz sections
      let livesRemaining = -1; // -1 = unlimited (premium)
      let lockedUntil: string | null = null;
      if (!user?.isPremium && !progress?.completed) {
        const attempts = progress?.attempts || 0;
        if (attempts >= 3 && progress?.lockedUntil) {
          const lock = new Date(progress.lockedUntil);
          if (lock > new Date()) {
            lockedUntil = lock.toISOString();
            livesRemaining = 0;
          } else {
            livesRemaining = 3;
          }
        } else {
          livesRemaining = Math.max(0, 3 - attempts);
        }
      }

      const moduleCompleted = !!progress?.completed;
      prevModuleCompleted = moduleCompleted;

      return {
        id: mod.id,
        type: mod.type,
        order: mod.order,
        title: mod.title,
        xpReward: mod.xpReward,
        unlocked,
        completed: moduleCompleted,
        // Section progress (for lesson modules)
        sections: isLesson ? {
          info: { completed: !!progress?.infoCompleted, hasContent: !!mod.content },
          video: { completed: !!progress?.videoCompleted, progress: progress?.videoProgress || 0, hasVideo: !!mod.videoUrl },
          quiz: { completed: !!progress?.quizCompleted, score: progress?.quizScore || 0, attempts: progress?.quizAttempts || 0 },
        } : undefined,
        // For final exam
        score: progress?.score || 0,
        attempts: progress?.attempts || 0,
        livesRemaining,
        lockedUntil,
      };
    });

    const completedCount = modulesData.filter((m) => m.completed).length;

    return {
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      coverImage: chapter.coverImage,
      moduleTag: chapter.moduleTag,
      xpReward: chapter.xpReward,
      releaseWeek: chapter.releaseWeek,
      modules: chapterAccessible ? modulesData : [], // Don't send module data if locked
      completionPercent: chapterAccessible ? Math.round((completedCount / 4) * 100) : 0,
      isPremium: user?.isPremium || false,
      accessible: chapterAccessible,
      lockedReason,
    };
  }

  // ── User: complete info section ──────────────────────────────────────────

  async completeInfoModule(moduleId: string, userId: string) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod || mod.type !== 'lesson') throw new BadRequestException('Not a lesson module');

    let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
    progress.infoCompleted = true;
    return this.progressRepo.save(progress);
  }

  // ── User: update video progress ─────────────────────────────────────────

  async updateVideoProgress(moduleId: string, userId: string, percent: number) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod || mod.type !== 'lesson') throw new BadRequestException('Not a lesson module');

    let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
    progress.videoProgress = Math.max(progress.videoProgress, percent);

    if (progress.videoProgress >= 90 && !progress.videoCompleted) {
      progress.videoCompleted = true;
    }

    return this.progressRepo.save(progress);
  }

  // ── User: get quiz questions (for module quiz or final exam) ─────────────

  async getQuizQuestions(moduleId: string, userId: string) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    const user = await this.usersRepo.findOne({ where: { id: userId } });

    // For lesson modules, verify info + video are done before quiz
    if (mod.type === 'lesson') {
      const progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
      if (!progress?.infoCompleted) {
        throw new ForbiddenException('Completa la lectura primero');
      }
      if (mod.videoUrl && !progress?.videoCompleted) {
        throw new ForbiddenException('Completa el video primero');
      }
    }

    // Check lives
    if (!user?.isPremium) {
      const progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
      if (progress && !progress.completed) {
        const attempts = mod.type === 'final_exam' ? progress.attempts : progress.quizAttempts;
        if (attempts >= 3 && progress.lockedUntil) {
          const lock = new Date(progress.lockedUntil);
          if (lock > new Date()) {
            throw new ForbiddenException({
              message: 'Quiz bloqueado. Espera para intentar de nuevo.',
              lockedUntil: lock.toISOString(),
              livesRemaining: 0,
            });
          }
          // Lock expired, reset
          if (mod.type === 'final_exam') {
            progress.attempts = 0;
          } else {
            progress.quizAttempts = 0;
          }
          progress.lockedUntil = undefined as any;
          await this.progressRepo.save(progress);
        }
      }
    }

    // For final exam, merge questions from all 3 lesson modules
    let pool: QuizQuestion[] = [];
    if (mod.type === 'final_exam') {
      const chapter = await this.findOne(mod.chapterId);
      for (const m of chapter.modules) {
        if (m.type === 'lesson' && m.questionsPool) {
          pool.push(...JSON.parse(m.questionsPool));
        }
      }
      // Also add module's own questions if any
      if (mod.questionsPool) {
        pool.push(...JSON.parse(mod.questionsPool));
      }
    } else {
      pool = mod.questionsPool ? JSON.parse(mod.questionsPool) : [];
    }

    // Shuffle questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, mod.questionsPerAttempt || 5);

    // Shuffle options within each question (Fisher-Yates)
    const questions = selected.map((q) => {
      const indices = q.options.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return {
        ...q,
        options: indices.map((i) => q.options[i]),
        correctIndex: indices.indexOf(q.correctIndex),
      };
    });

    return {
      moduleId: mod.id,
      chapterId: mod.chapterId,
      type: mod.type,
      passingScore: mod.passingScore,
      totalQuestions: questions.length,
      questions: questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: q.options,
      })),
    };
  }

  // ── User: submit quiz answers ────────────────────────────────────────────

  async submitQuiz(moduleId: string, userId: string, answers: { questionId: string; selectedIndex: number }[]) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');

    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Build question map from the correct pool
    let pool: QuizQuestion[] = [];
    if (mod.type === 'final_exam') {
      const chapter = await this.findOne(mod.chapterId);
      for (const m of chapter.modules) {
        if (m.type === 'lesson' && m.questionsPool) pool.push(...JSON.parse(m.questionsPool));
      }
      if (mod.questionsPool) pool.push(...JSON.parse(mod.questionsPool));
    } else {
      pool = mod.questionsPool ? JSON.parse(mod.questionsPool) : [];
    }
    const qMap = new Map(pool.map((q) => [q.id, q]));

    // Grade
    let correct = 0;
    const results = answers.map((a) => {
      const q = qMap.get(a.questionId);
      if (!q) return { questionId: a.questionId, correct: false };
      const ok = q.correctIndex === a.selectedIndex;
      if (ok) correct++;
      return { questionId: a.questionId, correct: ok, correctIndex: q.correctIndex, explanation: q.explanation };
    });

    const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
    const passed = score >= mod.passingScore;
    let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);

    const isFinalExam = mod.type === 'final_exam';

    if (isFinalExam) {
      progress.attempts += 1;
      progress.score = Math.max(progress.score, score);
    } else {
      progress.quizAttempts += 1;
      progress.quizScore = Math.max(progress.quizScore, score);
    }

    if (passed) {
      if (isFinalExam && !progress.completed) {
        progress.completed = true;
        progress.score = Math.max(progress.score, score);
        progress.completedAt = new Date();
        progress.xpEarned = mod.xpReward;
        user.xp += mod.xpReward;
        user.totalXp += mod.xpReward;
        await this.usersRepo.save(user);
      } else if (!isFinalExam && !progress.quizCompleted) {
        progress.quizCompleted = true;
        progress.quizScore = Math.max(progress.quizScore, score);
        // Module complete when all 3 sections done
        if (progress.infoCompleted && (progress.videoCompleted || !mod.videoUrl)) {
          progress.completed = true;
          progress.completedAt = new Date();
          progress.xpEarned = mod.xpReward;
          user.xp += mod.xpReward;
          user.totalXp += mod.xpReward;
          await this.usersRepo.save(user);
        }
      }
    }

    // Lives for free users
    let livesRemaining = -1;
    let lockedUntil: string | null = null;
    if (!user.isPremium && !passed) {
      const failedAttempts = isFinalExam ? progress.attempts : progress.quizAttempts;
      if (failedAttempts >= 3) {
        const lock = new Date(Date.now() + 24 * 60 * 60 * 1000);
        progress.lockedUntil = lock;
        lockedUntil = lock.toISOString();
        livesRemaining = 0;
      } else {
        livesRemaining = 3 - failedAttempts;
      }
    }

    await this.progressRepo.save(progress);

    return {
      score, passed, correctCount: correct, totalQuestions: answers.length, results,
      xpEarned: passed ? mod.xpReward : 0,
      livesRemaining, lockedUntil,
      moduleCompleted: progress.completed,
      message: passed
        ? '¡Felicidades! Has aprobado.'
        : livesRemaining === 0
          ? '¡Sin vidas! Espera 24 horas para intentar de nuevo.'
          : `Necesitas ${mod.passingScore}% para pasar. Obtuviste ${score}%.${livesRemaining >= 0 ? ` Te quedan ${livesRemaining} vidas.` : ''}`,
    };
  }

  // ── User: report abandon ─────────────────────────────────────────────────

  async reportQuizAbandon(moduleId: string, userId: string, reason: string) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new BadRequestException('Module not found');
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);

    if (progress.completed) return { penalized: false, reason: 'already_completed' };

    if (mod.type === 'final_exam') {
      progress.attempts += 1;
    } else {
      progress.quizAttempts += 1;
    }

    let livesRemaining = -1;
    let lockedUntil: string | null = null;

    if (!user?.isPremium) {
      const attempts = mod.type === 'final_exam' ? progress.attempts : progress.quizAttempts;
      if (attempts >= 3) {
        const lock = new Date(Date.now() + 24 * 60 * 60 * 1000);
        progress.lockedUntil = lock;
        lockedUntil = lock.toISOString();
        livesRemaining = 0;
      } else {
        livesRemaining = 3 - attempts;
      }
    }

    await this.progressRepo.save(progress);

    return {
      penalized: true, reason, livesRemaining, lockedUntil,
      message: livesRemaining === 0
        ? 'Perdiste todas tus vidas por abandonar el quiz. Espera 24 horas.'
        : `Perdiste una vida por abandonar el quiz.${livesRemaining >= 0 ? ` Te quedan ${livesRemaining} vidas.` : ''}`,
    };
  }

  // ── User: unlock final exam (Free pays $10) ─────────────────────────────

  async unlockFinalExam(chapterId: string, userId: string) {
    const chapter = await this.findOne(chapterId);
    const mod4 = chapter.modules.find((m) => m.order === 4);
    if (!mod4) throw new NotFoundException('Final exam not found');

    const mod3 = chapter.modules.find((m) => m.order === 3);
    if (mod3) {
      const p = await this.progressRepo.findOne({ where: { moduleId: mod3.id, userId } });
      if (!p?.completed) throw new ForbiddenException('Completa el Módulo 3 primero');
    }

    await this.getOrCreateProgress(chapterId, mod4.id, userId);
    return { unlocked: true, moduleId: mod4.id };
  }

  // ── User: get module detail (info content) ──────────────────────────────

  async getModuleContent(moduleId: string) {
    const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
    if (!mod) throw new NotFoundException('Module not found');
    return {
      id: mod.id,
      type: mod.type,
      order: mod.order,
      title: mod.title,
      content: mod.content,
      videoUrl: mod.videoUrl,
      hasQuiz: !!mod.questionsPool,
    };
  }

  // ── Helper ──────────────────────────────────────────────────────────────

  private async getOrCreateProgress(chapterId: string, moduleId: string, userId: string) {
    let progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
    if (!progress) {
      progress = this.progressRepo.create({
        userId, chapterId, moduleId,
        infoCompleted: false, videoCompleted: false, videoProgress: 0,
        quizCompleted: false, quizScore: 0, quizAttempts: 0,
        completed: false, score: 0, attempts: 0, xpEarned: 0,
      });
      progress = await this.progressRepo.save(progress);
    }
    return progress;
  }
}
