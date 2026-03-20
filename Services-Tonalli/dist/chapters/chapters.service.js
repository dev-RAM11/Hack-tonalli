"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaptersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chapter_entity_1 = require("./entities/chapter.entity");
const chapter_module_entity_1 = require("./entities/chapter-module.entity");
const chapter_progress_entity_1 = require("./entities/chapter-progress.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ChaptersService = class ChaptersService {
    chaptersRepo;
    modulesRepo;
    progressRepo;
    usersRepo;
    constructor(chaptersRepo, modulesRepo, progressRepo, usersRepo) {
        this.chaptersRepo = chaptersRepo;
        this.modulesRepo = modulesRepo;
        this.progressRepo = progressRepo;
        this.usersRepo = usersRepo;
    }
    async create(dto) {
        const chapter = this.chaptersRepo.create(dto);
        const saved = await this.chaptersRepo.save(chapter);
        const modules = [
            { type: 'lesson', order: 1, title: 'Módulo 1', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'lesson', order: 2, title: 'Módulo 2', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'lesson', order: 3, title: 'Módulo 3', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'final_exam', order: 4, title: 'Examen Final', questionsPerAttempt: 10, xpReward: 50 },
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
    getCurrentWeek() {
        const now = new Date();
        const jan1 = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - jan1.getTime()) / 86400000);
        const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    }
    getNextWeek() {
        const now = new Date();
        const next = new Date(now.getTime() + 7 * 86400000);
        const jan1 = new Date(next.getFullYear(), 0, 1);
        const days = Math.floor((next.getTime() - jan1.getTime()) / 86400000);
        const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7);
        return `${next.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    }
    async findAll() {
        return this.chaptersRepo.find({ relations: ['modules'], order: { order: 'ASC' } });
    }
    async findAllPublished() {
        return this.chaptersRepo.find({ where: { published: true }, relations: ['modules'], order: { order: 'ASC' } });
    }
    async findPublishedForUser(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        const allPublished = await this.chaptersRepo.find({
            where: { published: true },
            relations: ['modules'],
            order: { order: 'ASC' },
        });
        const currentWeek = this.getCurrentWeek();
        const nextWeek = this.getNextWeek();
        return allPublished.map((ch) => {
            let accessible = true;
            let reason = '';
            if (ch.releaseWeek) {
                if (user?.isPremium) {
                    accessible = ch.releaseWeek <= nextWeek;
                    if (!accessible)
                        reason = 'premium_future';
                }
                else {
                    accessible = ch.releaseWeek <= currentWeek;
                    if (!accessible)
                        reason = 'free_locked';
                }
            }
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
                accessible,
                lockedReason: accessible ? null : reason,
                currentWeek,
            };
        });
    }
    async findOne(id) {
        const ch = await this.chaptersRepo.findOne({ where: { id }, relations: ['modules'] });
        if (!ch)
            throw new common_1.NotFoundException(`Chapter ${id} not found`);
        if (ch.modules)
            ch.modules.sort((a, b) => a.order - b.order);
        return ch;
    }
    async update(id, dto) {
        const ch = await this.findOne(id);
        Object.assign(ch, dto);
        return this.chaptersRepo.save(ch);
    }
    async remove(id) {
        await this.chaptersRepo.remove(await this.findOne(id));
    }
    async togglePublish(id) {
        const ch = await this.findOne(id);
        ch.published = !ch.published;
        return this.chaptersRepo.save(ch);
    }
    async setReleaseWeek(id, week) {
        const ch = await this.findOne(id);
        ch.releaseWeek = week;
        return this.chaptersRepo.save(ch);
    }
    async releaseThisWeek(id) {
        return this.setReleaseWeek(id, this.getCurrentWeek());
    }
    async updateModule(moduleId, data) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        Object.assign(mod, data);
        return this.modulesRepo.save(mod);
    }
    async getChapterWithProgress(chapterId, userId) {
        const chapter = await this.findOne(chapterId);
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        let chapterAccessible = true;
        let lockedReason = null;
        if (chapter.releaseWeek) {
            const currentWeek = this.getCurrentWeek();
            const nextWeek = this.getNextWeek();
            if (user?.isPremium) {
                chapterAccessible = chapter.releaseWeek <= nextWeek;
                if (!chapterAccessible)
                    lockedReason = 'Este capitulo se libera en una semana futura.';
            }
            else {
                chapterAccessible = chapter.releaseWeek <= currentWeek;
                if (!chapterAccessible)
                    lockedReason = 'Este capitulo aun no esta disponible para tu plan. Se libera la semana ' + chapter.releaseWeek + '.';
            }
        }
        const allProgress = await this.progressRepo.find({ where: { chapterId, userId } });
        const progressMap = new Map(allProgress.map((p) => [p.moduleId, p]));
        let prevModuleCompleted = true;
        const modulesData = chapter.modules.map((mod) => {
            const progress = progressMap.get(mod.id);
            const isLesson = mod.type === 'lesson';
            let unlocked = false;
            if (mod.order === 1) {
                unlocked = true;
            }
            else if (mod.order <= 3) {
                unlocked = prevModuleCompleted;
            }
            else {
                const mod3 = chapter.modules.find((m) => m.order === 3);
                const mod3Progress = mod3 ? progressMap.get(mod3.id) : null;
                const mod3Done = !!mod3Progress?.completed;
                unlocked = mod3Done && (user?.isPremium || !!progress);
            }
            let livesRemaining = -1;
            let lockedUntil = null;
            if (!user?.isPremium && !progress?.completed) {
                const attempts = progress?.attempts || 0;
                if (attempts >= 3 && progress?.lockedUntil) {
                    const lock = new Date(progress.lockedUntil);
                    if (lock > new Date()) {
                        lockedUntil = lock.toISOString();
                        livesRemaining = 0;
                    }
                    else {
                        livesRemaining = 3;
                    }
                }
                else {
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
                sections: isLesson ? {
                    info: { completed: !!progress?.infoCompleted, hasContent: !!mod.content },
                    video: { completed: !!progress?.videoCompleted, progress: progress?.videoProgress || 0, hasVideo: !!mod.videoUrl },
                    quiz: { completed: !!progress?.quizCompleted, score: progress?.quizScore || 0, attempts: progress?.quizAttempts || 0 },
                } : undefined,
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
            modules: chapterAccessible ? modulesData : [],
            completionPercent: chapterAccessible ? Math.round((completedCount / 4) * 100) : 0,
            isPremium: user?.isPremium || false,
            accessible: chapterAccessible,
            lockedReason,
        };
    }
    async completeInfoModule(moduleId, userId) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod || mod.type !== 'lesson')
            throw new common_1.BadRequestException('Not a lesson module');
        let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
        progress.infoCompleted = true;
        return this.progressRepo.save(progress);
    }
    async updateVideoProgress(moduleId, userId, percent) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod || mod.type !== 'lesson')
            throw new common_1.BadRequestException('Not a lesson module');
        let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
        progress.videoProgress = Math.max(progress.videoProgress, percent);
        if (progress.videoProgress >= 90 && !progress.videoCompleted) {
            progress.videoCompleted = true;
        }
        return this.progressRepo.save(progress);
    }
    async getQuizQuestions(moduleId, userId) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (mod.type === 'lesson') {
            const progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
            if (!progress?.infoCompleted) {
                throw new common_1.ForbiddenException('Completa la lectura primero');
            }
            if (mod.videoUrl && !progress?.videoCompleted) {
                throw new common_1.ForbiddenException('Completa el video primero');
            }
        }
        if (!user?.isPremium) {
            const progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
            if (progress && !progress.completed) {
                const attempts = mod.type === 'final_exam' ? progress.attempts : progress.quizAttempts;
                if (attempts >= 3 && progress.lockedUntil) {
                    const lock = new Date(progress.lockedUntil);
                    if (lock > new Date()) {
                        throw new common_1.ForbiddenException({
                            message: 'Quiz bloqueado. Espera para intentar de nuevo.',
                            lockedUntil: lock.toISOString(),
                            livesRemaining: 0,
                        });
                    }
                    if (mod.type === 'final_exam') {
                        progress.attempts = 0;
                    }
                    else {
                        progress.quizAttempts = 0;
                    }
                    progress.lockedUntil = undefined;
                    await this.progressRepo.save(progress);
                }
            }
        }
        let pool = [];
        if (mod.type === 'final_exam') {
            const chapter = await this.findOne(mod.chapterId);
            for (const m of chapter.modules) {
                if (m.type === 'lesson' && m.questionsPool) {
                    pool.push(...JSON.parse(m.questionsPool));
                }
            }
            if (mod.questionsPool) {
                pool.push(...JSON.parse(mod.questionsPool));
            }
        }
        else {
            pool = mod.questionsPool ? JSON.parse(mod.questionsPool) : [];
        }
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, mod.questionsPerAttempt || 5);
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
    async submitQuiz(moduleId, userId, answers) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        let pool = [];
        if (mod.type === 'final_exam') {
            const chapter = await this.findOne(mod.chapterId);
            for (const m of chapter.modules) {
                if (m.type === 'lesson' && m.questionsPool)
                    pool.push(...JSON.parse(m.questionsPool));
            }
            if (mod.questionsPool)
                pool.push(...JSON.parse(mod.questionsPool));
        }
        else {
            pool = mod.questionsPool ? JSON.parse(mod.questionsPool) : [];
        }
        const qMap = new Map(pool.map((q) => [q.id, q]));
        let correct = 0;
        const results = answers.map((a) => {
            const q = qMap.get(a.questionId);
            if (!q)
                return { questionId: a.questionId, correct: false };
            const ok = q.correctIndex === a.selectedIndex;
            if (ok)
                correct++;
            return { questionId: a.questionId, correct: ok, correctIndex: q.correctIndex, explanation: q.explanation };
        });
        const score = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
        const passed = score >= mod.passingScore;
        let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
        const isFinalExam = mod.type === 'final_exam';
        if (isFinalExam) {
            progress.attempts += 1;
            progress.score = Math.max(progress.score, score);
        }
        else {
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
            }
            else if (!isFinalExam && !progress.quizCompleted) {
                progress.quizCompleted = true;
                progress.quizScore = Math.max(progress.quizScore, score);
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
        let livesRemaining = -1;
        let lockedUntil = null;
        if (!user.isPremium && !passed) {
            const failedAttempts = isFinalExam ? progress.attempts : progress.quizAttempts;
            if (failedAttempts >= 3) {
                const lock = new Date(Date.now() + 24 * 60 * 60 * 1000);
                progress.lockedUntil = lock;
                lockedUntil = lock.toISOString();
                livesRemaining = 0;
            }
            else {
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
    async reportQuizAbandon(moduleId, userId, reason) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.BadRequestException('Module not found');
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        let progress = await this.getOrCreateProgress(mod.chapterId, moduleId, userId);
        if (progress.completed)
            return { penalized: false, reason: 'already_completed' };
        if (mod.type === 'final_exam') {
            progress.attempts += 1;
        }
        else {
            progress.quizAttempts += 1;
        }
        let livesRemaining = -1;
        let lockedUntil = null;
        if (!user?.isPremium) {
            const attempts = mod.type === 'final_exam' ? progress.attempts : progress.quizAttempts;
            if (attempts >= 3) {
                const lock = new Date(Date.now() + 24 * 60 * 60 * 1000);
                progress.lockedUntil = lock;
                lockedUntil = lock.toISOString();
                livesRemaining = 0;
            }
            else {
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
    async unlockFinalExam(chapterId, userId) {
        const chapter = await this.findOne(chapterId);
        const mod4 = chapter.modules.find((m) => m.order === 4);
        if (!mod4)
            throw new common_1.NotFoundException('Final exam not found');
        const mod3 = chapter.modules.find((m) => m.order === 3);
        if (mod3) {
            const p = await this.progressRepo.findOne({ where: { moduleId: mod3.id, userId } });
            if (!p?.completed)
                throw new common_1.ForbiddenException('Completa el Módulo 3 primero');
        }
        await this.getOrCreateProgress(chapterId, mod4.id, userId);
        return { unlocked: true, moduleId: mod4.id };
    }
    async getModuleContent(moduleId) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
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
    async getOrCreateProgress(chapterId, moduleId, userId) {
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
};
exports.ChaptersService = ChaptersService;
exports.ChaptersService = ChaptersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chapter_entity_1.Chapter)),
    __param(1, (0, typeorm_1.InjectRepository)(chapter_module_entity_1.ChapterModule)),
    __param(2, (0, typeorm_1.InjectRepository)(chapter_progress_entity_1.ChapterProgress)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map