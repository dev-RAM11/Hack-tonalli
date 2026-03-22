"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const stellar_service_1 = require("../stellar/stellar.service");
const soroban_service_1 = require("../stellar/soroban.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UsersController = class UsersController {
    usersService;
    stellarService;
    sorobanService;
    constructor(usersService, stellarService, sorobanService) {
        this.usersService = usersService;
        this.stellarService = stellarService;
        this.sorobanService = sorobanService;
    }
    async getProfile(req) {
        return this.usersService.getProfile(req.user.id);
    }
    async updateProfile(req, body) {
        const updated = await this.usersService.update(req.user.id, body);
        return this.usersService.getProfile(updated.id);
    }
    async setupUser(req, body) {
        return this.usersService.setupUser(req.user.id, body.companion, body.avatarType);
    }
    async upgradePlan(req, body) {
        const plan = body.plan || 'pro';
        return this.usersService.upgradePlan(req.user.id, plan);
    }
    async getRankings() {
        return this.usersService.getRankings();
    }
    async getWalletBalance(req) {
        const user = await this.usersService.findById(req.user.id);
        const xlmBalance = user.stellarPublicKey
            ? await this.stellarService.getBalance(user.stellarPublicKey)
            : '0';
        const tnlBalance = user.stellarPublicKey
            ? await this.sorobanService.getTokenBalance(user.stellarPublicKey)
            : 0;
        return {
            custodialAddress: user.stellarPublicKey || null,
            externalAddress: user.externalWalletAddress || null,
            walletType: user.walletType || 'custodial',
            xlmBalance,
            tnlBalance,
        };
    }
    async connectWallet(req, body) {
        const user = await this.usersService.connectExternalWallet(req.user.id, body.address);
        return {
            message: 'External wallet connected successfully',
            externalWalletAddress: user.externalWalletAddress,
            walletType: user.walletType,
        };
    }
    async disconnectWallet(req) {
        const user = await this.usersService.disconnectExternalWallet(req.user.id);
        return {
            message: 'External wallet disconnected',
            walletType: user.walletType,
        };
    }
    async withdrawToExternal(req, body) {
        const user = await this.usersService.findById(req.user.id);
        if (!user.externalWalletAddress) {
            return { success: false, error: 'No external wallet connected' };
        }
        if (!user.stellarSecretKey) {
            return { success: false, error: 'No custodial wallet available' };
        }
        const result = await this.stellarService.sendXLMReward(user.stellarSecretKey, user.externalWalletAddress, body.amount);
        return {
            success: result.success,
            txHash: result.txHash,
            amount: body.amount,
            destination: user.externalWalletAddress,
            error: result.error,
        };
    }
    async exportSecret(req, body) {
        return this.usersService.exportSecretKey(req.user.id, body.password);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('users/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('users/me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('users/me/setup'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setupUser", null);
__decorate([
    (0, common_1.Patch)('users/me/upgrade'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "upgradePlan", null);
__decorate([
    (0, common_1.Get)('rankings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getRankings", null);
__decorate([
    (0, common_1.Get)('users/me/wallet/balance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getWalletBalance", null);
__decorate([
    (0, common_1.Post)('users/me/wallet/connect'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "connectWallet", null);
__decorate([
    (0, common_1.Post)('users/me/wallet/disconnect'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "disconnectWallet", null);
__decorate([
    (0, common_1.Post)('users/me/wallet/withdraw'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "withdrawToExternal", null);
__decorate([
    (0, common_1.Post)('users/me/wallet/export-secret'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "exportSecret", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        stellar_service_1.StellarService,
        soroban_service_1.SorobanService])
], UsersController);
//# sourceMappingURL=users.controller.js.map