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
var ProgressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const progress_entity_1 = require("./entities/progress.entity");
const nft_certificate_entity_1 = require("./entities/nft-certificate.entity");
const users_service_1 = require("../users/users.service");
const stellar_service_1 = require("../stellar/stellar.service");
const soroban_service_1 = require("../stellar/soroban.service");
const lesson_entity_1 = require("../lessons/entities/lesson.entity");
const quiz_entity_1 = require("../lessons/entities/quiz.entity");
let ProgressService = ProgressService_1 = class ProgressService {
    progressRepository;
    nftRepository;
    lessonRepository;
    quizRepository;
    usersService;
    stellarService;
    sorobanService;
    logger = new common_1.Logger(ProgressService_1.name);
    constructor(progressRepository, nftRepository, lessonRepository, quizRepository, usersService, stellarService, sorobanService) {
        this.progressRepository = progressRepository;
        this.nftRepository = nftRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.usersService = usersService;
        this.stellarService = stellarService;
        this.sorobanService = sorobanService;
    }
    async submitQuiz(userId, lessonId, answers) {
        const quiz = await this.quizRepository.findOne({ where: { lessonId } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        const pool = JSON.parse(quiz.questionsPool);
        const questionMap = new Map(pool.map((q) => [q.id, q]));
        let correctCount = 0;
        const results = answers.map((answer) => {
            const question = questionMap.get(answer.questionId);
            if (!question)
                return { questionId: answer.questionId, correct: false };
            const isCorrect = question.correctIndex === answer.selectedIndex;
            if (isCorrect)
                correctCount++;
            return {
                questionId: answer.questionId,
                correct: isCorrect,
                correctIndex: question.correctIndex,
                explanation: question.explanation,
            };
        });
        const score = answers.length > 0
            ? Math.round((correctCount / answers.length) * 100)
            : 0;
        const passed = score >= quiz.passingScore;
        let progress = await this.progressRepository.findOne({
            where: { userId, lessonId },
        });
        if (!progress) {
            progress = this.progressRepository.create({ userId, lessonId });
            progress.xpEarned = 0;
            progress.attempts = 0;
            progress.score = 0;
        }
        progress.attempts += 1;
        progress.score = Math.max(progress.score, score);
        let xpEarned = 0;
        let xlmReward = null;
        let nftCertificate = null;
        const wasAlreadyCompleted = progress.completed;
        if (passed && !wasAlreadyCompleted) {
            progress.completed = true;
            progress.completedAt = new Date();
            const lesson = await this.lessonRepository.findOne({
                where: { id: lessonId },
            });
            const user = await this.usersService.findById(userId);
            xpEarned = lesson?.xpReward || 50;
            await this.usersService.addXP(userId, xpEarned);
            await this.usersService.updateStreak(userId);
            if (user.stellarPublicKey && lesson?.xlmReward) {
                try {
                    await this.stellarService.ensureAccountFunded(user.stellarPublicKey);
                    const xlmResult = await this.stellarService.sendRewardFromAdmin(user.stellarPublicKey, lesson.xlmReward);
                    if (xlmResult.success) {
                        xlmReward = { amount: lesson.xlmReward, txHash: xlmResult.txHash };
                    }
                }
                catch (error) {
                    this.logger.error(`XLM reward failed: ${error.message}`);
                }
            }
            if (user.stellarPublicKey && lesson) {
                try {
                    const tnlAmount = (lesson.xpReward || 50) / 10;
                    await this.sorobanService.mintTokens(user.stellarPublicKey, tnlAmount);
                }
                catch (error) {
                    this.logger.error(`TNL mint failed: ${error.message}`);
                }
            }
            if (user.stellarPublicKey && lesson) {
                try {
                    const nftResult = await this.stellarService.mintNFTFromAdmin(user.stellarPublicKey, lesson.title, lessonId);
                    const cert = this.nftRepository.create({
                        userId,
                        lessonId,
                        txHash: nftResult.txHash,
                        assetCode: nftResult.assetCode,
                        issuerPublicKey: nftResult.issuerPublicKey || user.stellarPublicKey,
                        status: nftResult.success ? 'minted' : 'simulated',
                    });
                    nftCertificate = await this.nftRepository.save(cert);
                }
                catch (error) {
                    this.logger.error(`NFT mint failed: ${error.message}`);
                }
            }
        }
        progress.xpEarned = Math.max(progress.xpEarned || 0, xpEarned);
        await this.progressRepository.save(progress);
        return {
            score,
            passed,
            correctCount,
            totalQuestions: answers.length,
            results,
            xpEarned,
            xlmReward,
            nftCertificate: nftCertificate
                ? {
                    id: nftCertificate.id,
                    txHash: nftCertificate.txHash,
                    assetCode: nftCertificate.assetCode,
                    status: nftCertificate.status,
                }
                : null,
            alreadyCompleted: wasAlreadyCompleted,
            message: passed
                ? wasAlreadyCompleted
                    ? '¡Ya completaste esta lección! Buen repaso.'
                    : '¡Felicidades! Has completado la lección y ganado tu NFT.'
                : `¡Sigue intentando! Necesitas ${quiz.passingScore}% para pasar. Obtuviste ${score}%.`,
        };
    }
    async getUserProgress(userId) {
        const progresses = await this.progressRepository.find({
            where: { userId },
            relations: ['lesson'],
        });
        return progresses.map((p) => ({
            id: p.id,
            lessonId: p.lessonId,
            lessonTitle: p.lesson?.title,
            completed: p.completed,
            score: p.score,
            attempts: p.attempts,
            xpEarned: p.xpEarned,
            completedAt: p.completedAt,
        }));
    }
    async getUserCertificates(userId) {
        const certs = await this.nftRepository.find({
            where: { userId },
            relations: ['lesson'],
            order: { issuedAt: 'DESC' },
        });
        return certs.map((cert) => ({
            id: cert.id,
            lessonTitle: cert.lesson?.title || 'Lección completada',
            txHash: cert.txHash,
            assetCode: cert.assetCode,
            issuerPublicKey: cert.issuerPublicKey,
            status: cert.status,
            issuedAt: cert.issuedAt,
            stellarExplorerUrl: cert.txHash
                ? `https://stellar.expert/explorer/testnet/tx/${cert.txHash}`
                : null,
        }));
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = ProgressService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(progress_entity_1.Progress)),
    __param(1, (0, typeorm_1.InjectRepository)(nft_certificate_entity_1.NFTCertificate)),
    __param(2, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        stellar_service_1.StellarService,
        soroban_service_1.SorobanService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map