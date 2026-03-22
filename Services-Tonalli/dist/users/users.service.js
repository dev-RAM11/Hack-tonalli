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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const StellarSdk = __importStar(require("@stellar/stellar-sdk"));
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findByUsername(username) {
        return this.userRepository.findOne({ where: { username } });
    }
    async create(data) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
    async update(id, data) {
        await this.userRepository.update(id, data);
        return this.findById(id);
    }
    async addXP(userId, xp) {
        const user = await this.findById(userId);
        user.xp += xp;
        user.totalXp += xp;
        return this.userRepository.save(user);
    }
    async updateStreak(userId) {
        const user = await this.findById(userId);
        const today = new Date().toISOString().split('T')[0];
        const lastActivity = user.lastActivityDate;
        if (lastActivity === today) {
            return user;
        }
        const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split('T')[0];
        if (lastActivity === yesterday) {
            user.currentStreak += 1;
        }
        else {
            user.currentStreak = 1;
        }
        user.lastActivityDate = today;
        return this.userRepository.save(user);
    }
    async setupUser(userId, companion, avatarType) {
        await this.userRepository.update(userId, {
            companion,
            avatarType,
            isFirstLogin: false,
        });
        return this.findById(userId);
    }
    async getProfile(userId) {
        const user = await this.findById(userId);
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            displayName: user.displayName,
            city: user.city,
            xp: user.xp,
            totalXp: user.totalXp,
            currentStreak: user.currentStreak,
            lastActivityDate: user.lastActivityDate,
            walletAddress: user.stellarPublicKey,
            externalWalletAddress: user.externalWalletAddress || null,
            walletType: user.walletType || 'custodial',
            character: user.character,
            plan: user.plan || 'free',
            isFirstLogin: user.isFirstLogin,
            companion: user.companion,
            avatarType: user.avatarType,
            createdAt: user.createdAt,
        };
    }
    async upgradePlan(userId, plan) {
        const user = await this.findById(userId);
        user.plan = plan;
        return this.userRepository.save(user);
    }
    async connectExternalWallet(userId, externalAddress) {
        try {
            StellarSdk.Keypair.fromPublicKey(externalAddress);
        }
        catch {
            throw new common_1.BadRequestException('Invalid Stellar address. Must be a valid ed25519 public key (starts with G)');
        }
        const user = await this.findById(userId);
        user.externalWalletAddress = externalAddress;
        user.walletType = 'hybrid';
        return this.userRepository.save(user);
    }
    async disconnectExternalWallet(userId) {
        const user = await this.findById(userId);
        user.externalWalletAddress = '';
        user.walletType = 'custodial';
        return this.userRepository.save(user);
    }
    async exportSecretKey(userId, password) {
        const user = await this.findById(userId);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new common_1.UnauthorizedException('Incorrect password');
        }
        if (!user.stellarSecretKey) {
            throw new common_1.NotFoundException('No custodial wallet found');
        }
        return { secretKey: user.stellarSecretKey };
    }
    async getWalletInfo(userId) {
        const user = await this.findById(userId);
        return {
            custodialAddress: user.stellarPublicKey || null,
            externalAddress: user.externalWalletAddress || null,
            walletType: user.walletType || 'custodial',
        };
    }
    async getRankings() {
        const users = await this.userRepository.find({
            order: { totalXp: 'DESC' },
            take: 50,
        });
        return users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            displayName: user.displayName || user.username,
            city: user.city || 'Ciudad de México',
            xp: user.totalXp,
            streak: user.currentStreak,
            character: user.character || 'chima',
        }));
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map