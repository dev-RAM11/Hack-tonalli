"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const users_service_1 = require("../users/users.service");
const stellar_service_1 = require("../stellar/stellar.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    stellarService;
    constructor(usersService, jwtService, stellarService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.stellarService = stellarService;
    }
    async register(dto) {
        if (dto.dateOfBirth) {
            const dob = new Date(dto.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            if (age < 18) {
                throw new common_1.BadRequestException('Debes ser mayor de 18 años para registrarte en Tonalli');
            }
        }
        const existingEmail = await this.usersService.findByEmail(dto.email);
        if (existingEmail)
            throw new common_1.ConflictException('Email already registered');
        const existingUsername = await this.usersService.findByUsername(dto.username);
        if (existingUsername)
            throw new common_1.ConflictException('Username already taken');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const stellarKeypair = this.stellarService.createKeypair();
        const user = await this.usersService.create({
            email: dto.email,
            username: dto.username,
            password: hashedPassword,
            displayName: dto.displayName || dto.username,
            city: dto.city || 'Ciudad de México',
            character: dto.character || 'chima',
            dateOfBirth: dto.dateOfBirth || undefined,
            stellarPublicKey: stellarKeypair.publicKey,
            stellarSecretKey: stellarKeypair.secretKey,
            xp: 0,
            totalXp: 0,
            currentStreak: 0,
        });
        this.stellarService.fundWithFriendbot(stellarKeypair.publicKey).then((result) => {
            if (result.success) {
                this.usersService.update(user.id, { isFunded: true });
            }
        });
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                xp: user.xp,
                totalXp: user.totalXp,
                currentStreak: user.currentStreak,
                walletAddress: user.stellarPublicKey,
                externalWalletAddress: user.externalWalletAddress || null,
                walletType: user.walletType || 'custodial',
                character: user.character,
                role: user.role || 'user',
                plan: user.plan || 'free',
                isFirstLogin: user.isFirstLogin,
                companion: user.companion,
                avatarType: user.avatarType,
            },
        };
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
        return {
            access_token: token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                xp: user.xp,
                totalXp: user.totalXp,
                currentStreak: user.currentStreak,
                walletAddress: user.stellarPublicKey,
                externalWalletAddress: user.externalWalletAddress || null,
                walletType: user.walletType || 'custodial',
                character: user.character,
                role: user.role || 'user',
                plan: user.plan || 'free',
                isFirstLogin: user.isFirstLogin,
                companion: user.companion,
                avatarType: user.avatarType,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        stellar_service_1.StellarService])
], AuthService);
//# sourceMappingURL=auth.service.js.map