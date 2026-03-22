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
const chapter_question_entity_1 = require("./entities/chapter-question.entity");
const user_entity_1 = require("../users/entities/user.entity");
const soroban_service_1 = require("../stellar/soroban.service");
let ChaptersService = class ChaptersService {
    chaptersRepo;
    modulesRepo;
    progressRepo;
    questionsRepo;
    usersRepo;
    sorobanService;
    constructor(chaptersRepo, modulesRepo, progressRepo, questionsRepo, usersRepo, sorobanService) {
        this.chaptersRepo = chaptersRepo;
        this.modulesRepo = modulesRepo;
        this.progressRepo = progressRepo;
        this.questionsRepo = questionsRepo;
        this.usersRepo = usersRepo;
        this.sorobanService = sorobanService;
    }
    async create(dto) {
        const chapter = this.chaptersRepo.create(dto);
        const saved = await this.chaptersRepo.save(chapter);
        const modules = [
            { type: 'lesson', order: 1, title: 'Módulo 1', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'lesson', order: 2, title: 'Módulo 2', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'lesson', order: 3, title: 'Módulo 3', questionsPerAttempt: 5, xpReward: 30 },
            { type: 'final_exam', order: 4, title: 'Examen Final', questionsPerAttempt: 20, xpReward: 50 },
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
        const userPlan = user?.plan || 'free';
        const allPublished = await this.chaptersRepo.find({
            where: { published: true },
            relations: ['modules'],
            order: { order: 'ASC' },
        });
        const currentWeek = this.getCurrentWeek();
        return allPublished.map((ch, index) => {
            let accessible = true;
            let reason = '';
            if (userPlan === 'free') {
                if (index >= 3) {
                    accessible = false;
                    reason = 'free_limit';
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
        let ch = await this.chaptersRepo.findOne({ where: { id }, relations: ['modules'] });
        if (!ch)
            ch = await this.chaptersRepo.findOne({ where: { moduleTag: id }, relations: ['modules'] });
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
    async getModuleQuestions(moduleId) {
        return this.questionsRepo.find({ where: { moduleId }, order: { order: 'ASC' } });
    }
    async replaceModuleQuestions(moduleId, questions) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        await this.questionsRepo.delete({ moduleId });
        for (const [idx, q] of questions.entries()) {
            await this.questionsRepo.save(this.questionsRepo.create({
                moduleId,
                question: q.question,
                options: q.options,
                correctIndex: q.correctIndex,
                explanation: q.explanation || '',
                order: idx,
            }));
        }
        return { success: true, count: questions.length };
    }
    async getChapterWithProgress(chapterId, userId) {
        const chapter = await this.findOne(chapterId);
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        const userPlan = user?.plan || 'free';
        let chapterAccessible = true;
        let lockedReason = null;
        if (userPlan === 'free') {
            const allPublished = await this.chaptersRepo.find({
                where: { published: true },
                order: { order: 'ASC' },
            });
            const chapterIndex = allPublished.findIndex(ch => ch.id === chapter.id);
            if (chapterIndex >= 3) {
                chapterAccessible = false;
                lockedReason = 'Este capitulo requiere plan Pro o Max. Los usuarios Free solo tienen acceso a los primeros 3 capitulos.';
            }
        }
        const allProgress = await this.progressRepo.find({ where: { chapterId: chapter.id, userId } });
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
                if (userPlan === 'free') {
                    unlocked = false;
                }
                else {
                    unlocked = mod3Done && (userPlan === 'max' || !!progress);
                }
            }
            let livesRemaining = -1;
            const lockedUntil = null;
            if (userPlan === 'free' && !progress?.completed) {
                if (mod.type === 'lesson') {
                    const attempts = progress?.quizAttempts || 0;
                    livesRemaining = Math.max(0, 2 - attempts);
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
            plan: userPlan,
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
        if (user?.plan === 'free' && mod.type === 'lesson') {
            const progress = await this.progressRepo.findOne({ where: { moduleId, userId } });
            if (progress && !progress.completed) {
                if (progress.quizAttempts >= 2) {
                    throw new common_1.ForbiddenException({
                        message: 'Debes reiniciar el módulo para intentar de nuevo.',
                        mustRedoModule: true,
                        livesRemaining: 0,
                    });
                }
            }
        }
        let pool = [];
        if (mod.type === 'final_exam') {
            const chapter = await this.findOne(mod.chapterId);
            for (const m of chapter.modules) {
                if (m.type === 'lesson') {
                    const mqs = await this.questionsRepo.find({ where: { moduleId: m.id } });
                    pool.push(...mqs);
                }
            }
            const extraQs = await this.questionsRepo.find({ where: { moduleId: mod.id } });
            pool.push(...extraQs);
        }
        else {
            pool = await this.questionsRepo.find({ where: { moduleId: mod.id } });
        }
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, mod.questionsPerAttempt || 5);
        return {
            moduleId: mod.id,
            chapterId: mod.chapterId,
            type: mod.type,
            passingScore: mod.passingScore,
            totalQuestions: selected.length,
            questions: selected.map((q) => ({
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
        let dbQuestions = [];
        if (mod.type === 'final_exam') {
            const chapter = await this.findOne(mod.chapterId);
            for (const m of chapter.modules) {
                if (m.type === 'lesson') {
                    const mqs = await this.questionsRepo.find({ where: { moduleId: m.id } });
                    dbQuestions.push(...mqs);
                }
            }
            const extraQs = await this.questionsRepo.find({ where: { moduleId: mod.id } });
            dbQuestions.push(...extraQs);
        }
        else {
            dbQuestions = await this.questionsRepo.find({ where: { moduleId: mod.id } });
        }
        const qMap = new Map(dbQuestions.map((q) => [q.id, q]));
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
                if (user.stellarPublicKey) {
                    try {
                        const chapter = await this.chaptersRepo.findOne({ where: { id: mod.chapterId } });
                        await this.sorobanService.mintCertificate({
                            userPublicKey: user.stellarPublicKey,
                            lessonId: mod.chapterId,
                            moduleId: mod.id,
                            username: user.username,
                            score,
                            xpEarned: mod.xpReward,
                            metadataUri: `https://tonalli.app/certificates/${mod.chapterId}`,
                        });
                    }
                    catch (e) {
                        console.error('NFT mint error:', e.message);
                    }
                }
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
        let mustRedoModule = false;
        if (user.plan === 'free' && !passed) {
            const failedAttempts = isFinalExam ? progress.attempts : progress.quizAttempts;
            if (failedAttempts >= 2 && !isFinalExam) {
                progress.infoCompleted = false;
                progress.videoCompleted = false;
                progress.videoProgress = 0;
                progress.quizCompleted = false;
                progress.quizAttempts = 0;
                progress.quizScore = 0;
                progress.completed = false;
                livesRemaining = 0;
                mustRedoModule = true;
            }
            else {
                livesRemaining = Math.max(0, 2 - failedAttempts);
            }
        }
        await this.progressRepo.save(progress);
        let message;
        if (passed) {
            message = '¡Felicidades! Has aprobado.';
        }
        else if (mustRedoModule) {
            message = 'Agotaste tus 2 intentos. El módulo ha sido reiniciado, deberás completar la lectura y el video de nuevo.';
        }
        else if (livesRemaining === 1) {
            message = `Necesitas ${mod.passingScore}% para pasar. Obtuviste ${score}%. Te queda 1 intento.`;
        }
        else {
            message = `Necesitas ${mod.passingScore}% para pasar. Obtuviste ${score}%.${livesRemaining >= 0 ? ` Te quedan ${livesRemaining} intentos.` : ''}`;
        }
        return {
            score, passed, correctCount: correct, totalQuestions: answers.length, results,
            xpEarned: passed ? mod.xpReward : 0,
            livesRemaining,
            moduleCompleted: progress.completed,
            mustRedoModule: mustRedoModule || false,
            message,
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
        let mustRedoModule = false;
        if (user?.plan === 'free') {
            const attempts = mod.type === 'final_exam' ? progress.attempts : progress.quizAttempts;
            if (attempts >= 2 && mod.type !== 'final_exam') {
                progress.infoCompleted = false;
                progress.videoCompleted = false;
                progress.videoProgress = 0;
                progress.quizCompleted = false;
                progress.quizAttempts = 0;
                progress.quizScore = 0;
                progress.completed = false;
                livesRemaining = 0;
                mustRedoModule = true;
            }
            else {
                livesRemaining = Math.max(0, 2 - attempts);
            }
        }
        await this.progressRepo.save(progress);
        let message;
        if (mustRedoModule) {
            message = 'Agotaste tus 2 intentos al abandonar. El módulo ha sido reiniciado, deberás completar la lectura y el video de nuevo.';
        }
        else if (livesRemaining === 1) {
            message = `Perdiste un intento por abandonar el quiz. Te queda 1 intento.`;
        }
        else {
            message = `Perdiste un intento por abandonar el quiz.${livesRemaining >= 0 ? ` Te quedan ${livesRemaining} intentos.` : ''}`;
        }
        return {
            penalized: true, reason, livesRemaining,
            mustRedoModule: mustRedoModule || false,
            message,
        };
    }
    async unlockFinalExam(chapterId, userId) {
        const chapter = await this.findOne(chapterId);
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        const userPlan = user?.plan || 'free';
        if (userPlan === 'free') {
            throw new common_1.ForbiddenException('Los usuarios Free no pueden acceder a certificaciones. Mejora tu plan a Pro o Max.');
        }
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
        const certCost = userPlan === 'pro' ? 2 : 0;
        return { unlocked: true, moduleId: mod4.id, certCost };
    }
    async getModuleContent(moduleId) {
        const mod = await this.modulesRepo.findOne({ where: { id: moduleId } });
        if (!mod)
            throw new common_1.NotFoundException('Module not found');
        const questionCount = await this.questionsRepo.count({ where: { moduleId: mod.id } });
        return {
            id: mod.id,
            type: mod.type,
            order: mod.order,
            title: mod.title,
            content: mod.content,
            videoUrl: mod.videoUrl,
            hasQuiz: questionCount > 0 || mod.type === 'final_exam',
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
    __param(3, (0, typeorm_1.InjectRepository)(chapter_question_entity_1.ChapterQuestion)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        soroban_service_1.SorobanService])
], ChaptersService);
//# sourceMappingURL=chapters.service.js.map