import { UsersService } from './users.service';
import { StellarService } from '../stellar/stellar.service';
import { SorobanService } from '../stellar/soroban.service';
export declare class UsersController {
    private readonly usersService;
    private readonly stellarService;
    private readonly sorobanService;
    constructor(usersService: UsersService, stellarService: StellarService, sorobanService: SorobanService);
    getProfile(req: any): Promise<any>;
    updateProfile(req: any, body: {
        displayName?: string;
        city?: string;
        character?: string;
    }): Promise<any>;
    setupUser(req: any, body: {
        companion: string;
        avatarType: string;
    }): Promise<import("./entities/user.entity").User>;
    upgradePlan(req: any, body: {
        plan: 'free' | 'pro' | 'max';
    }): Promise<import("./entities/user.entity").User>;
    getRewardHistory(req: any): Promise<import("../stellar/soroban.service").RewardHistoryEntry[]>;
    getTotalRewards(req: any): Promise<{
        totalStroops: number;
        totalXlm: number;
    }>;
    getRankings(): Promise<any[]>;
    getWalletBalance(req: any): Promise<{
        custodialAddress: string | null;
        externalAddress: string | null;
        walletType: "custodial" | "external" | "hybrid";
        xlmBalance: string;
        tnlBalance: number;
    }>;
    connectWallet(req: any, body: {
        address: string;
    }): Promise<{
        message: string;
        externalWalletAddress: string;
        walletType: "custodial" | "external" | "hybrid";
    }>;
    disconnectWallet(req: any): Promise<{
        message: string;
        walletType: "custodial" | "external" | "hybrid";
    }>;
    withdrawToExternal(req: any, body: {
        amount: string;
    }): Promise<{
        success: boolean;
        error: string;
        txHash?: undefined;
        amount?: undefined;
        destination?: undefined;
    } | {
        success: boolean;
        txHash: string | undefined;
        amount: string;
        destination: string;
        error: string | undefined;
    }>;
    exportSecret(req: any, body: {
        password: string;
    }): Promise<{
        secretKey: string;
    }>;
}
