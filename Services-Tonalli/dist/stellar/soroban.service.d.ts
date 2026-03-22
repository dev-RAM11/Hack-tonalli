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
    private submitSorobanTransaction;
    private simulateSorobanCall;
    private waitForTransaction;
    private getTransactionResult;
    getTokenBalance(userPublicKey: string): Promise<number>;
    private mockMintCertificate;
    private mockRewardUser;
}
