import { PodiumService } from './podium.service';
export declare class PodiumController {
    private readonly podiumService;
    constructor(podiumService: PodiumService);
    getWeeklyLeaderboard(req: any): Promise<{
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
    getUserPodiumNfts(req: any): Promise<{
        id: string;
        week: string;
        position: number;
        rewardUsd: number;
        rewardXlm: string;
        txHash: string;
        nftTxHash: string;
        createdAt: Date;
        stellarExplorerUrl: string | null;
    }[]>;
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
    distributeRewards(): Promise<import("./entities/podium-reward.entity").PodiumReward[]>;
    pauseRewards(): {
        paused: boolean;
    };
    resumeRewards(): {
        paused: boolean;
    };
}
