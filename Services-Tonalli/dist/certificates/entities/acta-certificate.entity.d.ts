import { User } from '../../users/entities/user.entity';
export declare class ActaCertificate {
    id: string;
    user: User;
    userId: string;
    chapterId: string;
    chapterTitle: string;
    actaVcId: string;
    txHash: string;
    examScore: number;
    status: 'pending' | 'issued' | 'failed';
    type: 'official' | 'achievement';
    issuedAt: Date;
}
