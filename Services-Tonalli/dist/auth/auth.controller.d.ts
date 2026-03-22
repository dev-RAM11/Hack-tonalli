import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            displayName: string;
            xp: number;
            walletAddress: string;
            externalWalletAddress: string | null;
            walletType: "custodial" | "external" | "hybrid";
            character: string;
            role: "user" | "admin" | "designer";
            plan: "free" | "pro" | "max";
            isFirstLogin: boolean;
            companion: string;
            avatarType: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            displayName: string;
            xp: number;
            totalXp: number;
            currentStreak: number;
            walletAddress: string;
            externalWalletAddress: string | null;
            walletType: "custodial" | "external" | "hybrid";
            character: string;
            role: "user" | "admin" | "designer";
            plan: "free" | "pro" | "max";
            isFirstLogin: boolean;
            companion: string;
            avatarType: string;
        };
    }>;
}
