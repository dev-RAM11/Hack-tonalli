import { Repository } from 'typeorm';
import { WeeklyScore } from './entities/weekly-score.entity';
import { PodiumReward } from './entities/podium-reward.entity';
import { User } from '../users/entities/user.entity';
import { StellarService } from '../stellar/stellar.service';
export declare class PodiumService {
    private readonly scoresRepo;
    private readonly rewardsRepo;
    private readonly usersRepo;
    private readonly stellarService;
    private readonly logger;
    private paused;
    constructor(scoresRepo: Repository<WeeklyScore>, rewardsRepo: Repository<PodiumReward>, usersRepo: Repository<User>, stellarService: StellarService);
    getCurrentWeek(): string;
    updateScore(userId: string): Promise<void>;
    recordChapterCompletion(userId: string, examScore: number): Promise<void>;
    getWeeklyLeaderboard(userId: string): Promise<{
        week: string;
        rewards: {
            first: number;
            second: number;
            third: number;
        };
        rankings: {
            rank: number;
            userId: string;
            username: string;
            displayName: string;
            city: string;
            character: string;
            totalScore: number;
            chaptersCompleted: number;
            avgExamScore: number;
            activeDays: number;
            isCurrentUser: boolean;
        }[];
    }>;
    getGlobalLeaderboard(): Promise<{
        rank: number;
        userId: string;
        username: string;
        displayName: string;
        city: string;
        xp: number;
        streak: number;
        character: string;
        plan: "free" | "pro" | "max";
    }[]>;
    getCityLeaderboard(city: string): Promise<{
        rank: number;
        userId: string;
        username: string;
        displayName: string;
        city: string;
        xp: number;
        streak: number;
        character: string;
    }[]>;
    pauseRewards(): void;
    resumeRewards(): void;
    handleWeeklyPodiumClose(): Promise<void>;
    distributeWeeklyRewards(week?: string): Promise<PodiumReward[]>;
}
