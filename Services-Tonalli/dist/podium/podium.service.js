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
var PodiumService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodiumService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const weekly_score_entity_1 = require("./entities/weekly-score.entity");
const podium_reward_entity_1 = require("./entities/podium-reward.entity");
const user_entity_1 = require("../users/entities/user.entity");
const stellar_service_1 = require("../stellar/stellar.service");
const soroban_service_1 = require("../stellar/soroban.service");
let PodiumService = PodiumService_1 = class PodiumService {
    scoresRepo;
    rewardsRepo;
    usersRepo;
    stellarService;
    sorobanService;
    logger = new common_1.Logger(PodiumService_1.name);
    paused = false;
    constructor(scoresRepo, rewardsRepo, usersRepo, stellarService, sorobanService) {
        this.scoresRepo = scoresRepo;
        this.rewardsRepo = rewardsRepo;
        this.usersRepo = usersRepo;
        this.stellarService = stellarService;
        this.sorobanService = sorobanService;
    }
    getCurrentWeek() {
        const now = new Date();
        const jan1 = new Date(now.getFullYear(), 0, 1);
        const days = Math.floor((now.getTime() - jan1.getTime()) / 86400000);
        const weekNum = Math.ceil((days + jan1.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
    }
    async updateScore(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (user?.plan === 'free')
            return;
        const week = this.getCurrentWeek();
        let score = await this.scoresRepo.findOne({ where: { userId, week } });
        if (!score) {
            score = this.scoresRepo.create({ userId, week });
        }
        score.activeDays = Math.min(7, (score.activeDays || 0) + 1);
        score.totalScore =
            score.chaptersCompleted * 100 +
                score.avgExamScore +
                score.activeDays * 10;
        await this.scoresRepo.save(score);
    }
    async recordChapterCompletion(userId, examScore) {
        const week = this.getCurrentWeek();
        let score = await this.scoresRepo.findOne({ where: { userId, week } });
        if (!score) {
            score = this.scoresRepo.create({ userId, week, activeDays: 1 });
        }
        score.chaptersCompleted += 1;
        const totalScores = score.chaptersCompleted;
        score.avgExamScore = Math.round(((score.avgExamScore * (totalScores - 1)) + examScore) / totalScores);
        score.totalScore =
            score.chaptersCompleted * 100 +
                score.avgExamScore +
                score.activeDays * 10;
        await this.scoresRepo.save(score);
    }
    async getWeeklyLeaderboard(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (user?.plan === 'free') {
            throw new common_1.ForbiddenException('El podio es exclusivo para usuarios Pro y Max');
        }
        const week = this.getCurrentWeek();
        const scores = await this.scoresRepo.find({
            where: { week },
            order: { totalScore: 'DESC' },
            take: 50,
            relations: ['user'],
        });
        return {
            week,
            rewards: { first: 15, second: 10, third: 5 },
            rankings: scores.map((s, i) => ({
                rank: i + 1,
                userId: s.userId,
                username: s.user?.username || 'Unknown',
                displayName: s.user?.displayName || s.user?.username,
                city: s.user?.city || 'Ciudad de México',
                character: s.user?.character || 'chima',
                totalScore: s.totalScore,
                chaptersCompleted: s.chaptersCompleted,
                avgExamScore: s.avgExamScore,
                activeDays: s.activeDays,
                isCurrentUser: s.userId === userId,
            })),
        };
    }
    async getGlobalLeaderboard() {
        const users = await this.usersRepo.find({
            order: { totalXp: 'DESC' },
            take: 50,
        });
        return users.map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName || u.username,
            city: u.city || 'Ciudad de México',
            xp: u.totalXp,
            streak: u.currentStreak,
            character: u.character || 'chima',
            plan: u.plan || 'free',
        }));
    }
    async getCityLeaderboard(city) {
        const users = await this.usersRepo.find({
            where: { city },
            order: { totalXp: 'DESC' },
            take: 50,
        });
        return users.map((u, i) => ({
            rank: i + 1,
            userId: u.id,
            username: u.username,
            displayName: u.displayName || u.username,
            city: u.city,
            xp: u.totalXp,
            streak: u.currentStreak,
            character: u.character || 'chima',
        }));
    }
    async getUserPodiumNfts(userId) {
        const rewards = await this.rewardsRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
        return rewards
            .filter((r) => r.status === 'paid')
            .map((r) => ({
            id: r.id,
            week: r.week,
            position: r.position,
            rewardUsd: r.rewardUsd,
            rewardXlm: r.rewardXlm,
            txHash: r.txHash,
            nftTxHash: r.nftTxHash,
            createdAt: r.createdAt,
            stellarExplorerUrl: r.nftTxHash
                ? `https://stellar.expert/explorer/testnet/tx/${r.nftTxHash}`
                : null,
        }));
    }
    pauseRewards() {
        this.paused = true;
        this.logger.warn('⚠️ Podium rewards PAUSED (circuit breaker activated)');
    }
    resumeRewards() {
        this.paused = false;
        this.logger.log('✅ Podium rewards RESUMED');
    }
    async handleWeeklyPodiumClose() {
        this.logger.log('[Podium] Closing weekly podium - Sunday 23:59 CDMX');
        try {
            await this.distributeWeeklyRewards();
        }
        catch (e) {
            this.logger.error('[Podium] Weekly distribution error:', e.message);
        }
    }
    async distributeWeeklyRewards(week) {
        if (this.paused) {
            throw new common_1.ForbiddenException('Rewards distribution is paused (circuit breaker)');
        }
        const targetWeek = week || this.getCurrentWeek();
        const scores = await this.scoresRepo.find({
            where: { week: targetWeek },
            order: { totalScore: 'DESC' },
            take: 3,
            relations: ['user'],
        });
        const rewardAmounts = [15, 10, 5];
        const results = [];
        for (let i = 0; i < Math.min(scores.length, 3); i++) {
            const score = scores[i];
            const user = score.user;
            const rewardUsd = rewardAmounts[i];
            if (user?.plan === 'free')
                continue;
            const reward = this.rewardsRepo.create({
                userId: score.userId,
                week: targetWeek,
                position: i + 1,
                rewardUsd,
            });
            if (user.stellarPublicKey) {
                const xlmAmount = (rewardUsd / 0.15).toFixed(2);
                reward.rewardXlm = xlmAmount;
                const rewardPoolSecret = process.env.REWARD_POOL_SECRET;
                let txHash = `SIMULATED_REWARD_${targetWeek}_${i + 1}_${Date.now()}`;
                try {
                    if (rewardPoolSecret) {
                        const result = await this.stellarService.sendXLMReward(rewardPoolSecret, user.stellarPublicKey, xlmAmount);
                        if (result.success && result.txHash) {
                            txHash = result.txHash;
                            reward.status = 'paid';
                        }
                        else {
                            this.logger.error(`XLM transfer failed for ${user.username}: ${result.error}`);
                            reward.status = 'pending';
                        }
                    }
                    else {
                        this.logger.warn('[Podium] REWARD_POOL_SECRET not set, using simulated txHash');
                        reward.status = 'paid';
                    }
                }
                catch (err) {
                    this.logger.error(`Reward payment failed for ${user.username}: ${err.message}`);
                    reward.status = 'pending';
                }
                reward.txHash = txHash;
                try {
                    const xlmStroops = Math.round(parseFloat(xlmAmount) * 10_000_000);
                    const nftResult = await this.sorobanService.mintPodiumNft({
                        week: targetWeek,
                        userPublicKey: user.stellarPublicKey,
                        rank: i + 1,
                        xlmRewardStroops: xlmStroops,
                        txHash,
                    });
                    if (nftResult.success) {
                        reward.nftTxHash = nftResult.txHash;
                        this.logger.log(`Podium NFT minted for ${user.username} (rank ${i + 1}), tx=${nftResult.txHash}`);
                    }
                }
                catch (nftErr) {
                    this.logger.error(`Podium NFT mint failed for ${user.username}: ${nftErr.message}`);
                }
            }
            else {
                reward.status = 'retained';
                reward.retainedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            }
            const saved = await this.rewardsRepo.save(reward);
            results.push(saved);
        }
        return results;
    }
};
exports.PodiumService = PodiumService;
__decorate([
    (0, schedule_1.Cron)('59 23 * * 0', { timeZone: 'America/Mexico_City' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PodiumService.prototype, "handleWeeklyPodiumClose", null);
exports.PodiumService = PodiumService = PodiumService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(weekly_score_entity_1.WeeklyScore)),
    __param(1, (0, typeorm_1.InjectRepository)(podium_reward_entity_1.PodiumReward)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stellar_service_1.StellarService,
        soroban_service_1.SorobanService])
], PodiumService);
//# sourceMappingURL=podium.service.js.map