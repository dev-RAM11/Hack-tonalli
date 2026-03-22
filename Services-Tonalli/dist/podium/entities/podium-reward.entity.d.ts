import { User } from '../../users/entities/user.entity';
export declare class PodiumReward {
    id: string;
    user: User;
    userId: string;
    week: string;
    position: number;
    rewardUsd: number;
    rewardXlm: string;
    txHash: string;
    nftTxHash: string;
    status: 'pending' | 'paid' | 'retained' | 'reassigned';
    retainedUntil: Date;
    createdAt: Date;
}
