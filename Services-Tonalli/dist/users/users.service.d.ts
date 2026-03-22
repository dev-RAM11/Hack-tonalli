import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    addXP(userId: string, xp: number): Promise<User>;
    updateStreak(userId: string): Promise<User>;
    setupUser(userId: string, companion: string, avatarType: string): Promise<User>;
    getProfile(userId: string): Promise<any>;
    upgradePlan(userId: string, plan: 'free' | 'pro' | 'max'): Promise<User>;
    connectExternalWallet(userId: string, externalAddress: string): Promise<User>;
    disconnectExternalWallet(userId: string): Promise<User>;
    exportSecretKey(userId: string, password: string): Promise<{
        secretKey: string;
    }>;
    getWalletInfo(userId: string): Promise<{
        custodialAddress: string | null;
        externalAddress: string | null;
        walletType: string;
    }>;
    getRankings(): Promise<any[]>;
}
