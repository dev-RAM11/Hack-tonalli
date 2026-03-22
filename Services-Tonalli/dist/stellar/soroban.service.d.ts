import { ConfigService } from '@nestjs/config';
export interface MintCertificateParams {
    userPublicKey: string;
    lessonId: string;
    moduleId: string;
    username: string;
    score: number;
    xpEarned: number;
    metadataUri?: string;
}
export interface RewardUserParams {
    userPublicKey: string;
    lessonId: string;
    amountXlm: number;
    score: number;
}
export interface MintPodiumNftParams {
    week: string;
    userPublicKey: string;
    rank: number;
    xlmRewardStroops: number;
    txHash: string;
}
export interface PodiumNFTData {
    rank: number;
    xlmReward: number;
    week: string;
    txHash: string;
    issuedAt: number;
    owner: string;
}
export interface RewardHistoryEntry {
    lessonId: string;
    amount: number;
    timestamp: number;
}
export interface CertificateData {
    tokenId: number;
    owner: string;
    lessonId: string;
    moduleId: string;
    username: string;
    score: number;
    xpEarned: number;
    issuedAt: number;
    metadataUri: string;
}
export declare class SorobanService {
    private configService;
    private readonly logger;
    private rpc;
    private adminKeypair;
    private network;
    private networkPassphrase;
    private nftContractId;
    private rewardsContractId;
    private tokenContractId;
    private podiumNftContractId;
    constructor(configService: ConfigService);
    mintCertificate(params: MintCertificateParams): Promise<{
        tokenId: number;
        txHash: string;
        contractId: string;
    }>;
    getCertificate(tokenId: number): Promise<CertificateData | null>;
    getUserCertificates(userPublicKey: string): Promise<number[]>;
    hasCertificate(userPublicKey: string, lessonId: string): Promise<boolean>;
    rewardUser(params: RewardUserParams): Promise<{
        amountXlm: number;
        amountStroops: number;
        txHash: string;
    }>;
    mintTokens(toPublicKey: string, amount: number): Promise<{
        success: boolean;
        txHash: string;
        amount: number;
    }>;
    getTokenBalance(publicKey: string): Promise<number>;
    initializeToken(): Promise<{
        success: boolean;
        txHash?: string;
    }>;
    mintPodiumNft(params: MintPodiumNftParams): Promise<{
        success: boolean;
        txHash: string;
    }>;
    getPodiumNft(week: string, userPublicKey: string): Promise<PodiumNFTData | null>;
    hasPodiumNft(week: string, userPublicKey: string): Promise<boolean>;
    getRewardHistory(userPublicKey: string): Promise<RewardHistoryEntry[]>;
    getUserTotalRewards(userPublicKey: string): Promise<number>;
    isLessonRewarded(userPublicKey: string, lessonId: string): Promise<boolean>;
    private submitSorobanTransaction;
    private simulateSorobanCall;
    private waitForTransaction;
    private getTransactionResult;
    private mockMintCertificate;
    private mockMintTokens;
    private mockMintPodiumNft;
    private mockRewardUser;
}
