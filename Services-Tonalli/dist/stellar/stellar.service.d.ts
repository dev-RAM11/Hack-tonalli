import { ConfigService } from '@nestjs/config';
export interface StellarKeypair {
    publicKey: string;
    secretKey: string;
}
export interface FundResult {
    success: boolean;
    txHash?: string;
    error?: string;
}
export interface NFTMintResult {
    success: boolean;
    txHash?: string;
    assetCode?: string;
    issuerPublicKey?: string;
    error?: string;
}
export declare class StellarService {
    private readonly configService;
    private readonly logger;
    private readonly server;
    private readonly networkPassphrase;
    private readonly rewardPoolSecret;
    constructor(configService: ConfigService);
    createKeypair(): StellarKeypair;
    fundWithFriendbot(publicKey: string): Promise<FundResult>;
    getBalance(publicKey: string): Promise<string>;
    sendXLMReward(fromSecretKey: string, toPublicKey: string, amount: string): Promise<{
        success: boolean;
        txHash?: string;
        error?: string;
    }>;
    mintNFT(userPublicKey: string, userSecretKey: string, lessonTitle: string, lessonId: string): Promise<NFTMintResult>;
    sendRewardFromAdmin(toPublicKey: string, amount: string): Promise<{
        success: boolean;
        txHash?: string;
        error?: string;
    }>;
    mintNFTFromAdmin(userPublicKey: string, lessonTitle: string, lessonId: string): Promise<NFTMintResult>;
    ensureAccountFunded(publicKey: string): Promise<boolean>;
}
