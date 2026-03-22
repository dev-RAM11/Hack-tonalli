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
var StellarService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const StellarSdk = __importStar(require("@stellar/stellar-sdk"));
let StellarService = StellarService_1 = class StellarService {
    configService;
    logger = new common_1.Logger(StellarService_1.name);
    server;
    networkPassphrase;
    rewardPoolSecret;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get('STELLAR_HORIZON_URL') ||
            'https://horizon-testnet.stellar.org';
        this.server = new StellarSdk.Horizon.Server(horizonUrl);
        this.networkPassphrase = StellarSdk.Networks.TESTNET;
        this.rewardPoolSecret =
            this.configService.get('REWARD_POOL_SECRET') || null;
    }
    createKeypair() {
        const keypair = StellarSdk.Keypair.random();
        return {
            publicKey: keypair.publicKey(),
            secretKey: keypair.secret(),
        };
    }
    async fundWithFriendbot(publicKey) {
        try {
            const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`);
            const data = await response.json();
            if (response.ok) {
                this.logger.log(`Funded account ${publicKey} via Friendbot`);
                return { success: true, txHash: data.hash || data.id };
            }
            else {
                this.logger.warn(`Friendbot funding issue: ${JSON.stringify(data)}`);
                return { success: false, error: JSON.stringify(data) };
            }
        }
        catch (error) {
            this.logger.error(`Friendbot error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async getBalance(publicKey) {
        try {
            const account = await this.server.loadAccount(publicKey);
            const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
            return xlmBalance ? xlmBalance.balance : '0';
        }
        catch {
            return '0';
        }
    }
    async sendXLMReward(fromSecretKey, toPublicKey, amount) {
        try {
            const sourceKeypair = StellarSdk.Keypair.fromSecret(fromSecretKey);
            const sourceAccount = await this.server.loadAccount(sourceKeypair.publicKey());
            const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(StellarSdk.Operation.payment({
                destination: toPublicKey,
                asset: StellarSdk.Asset.native(),
                amount: amount,
            }))
                .addMemo(StellarSdk.Memo.text('Tonalli XLM Reward'))
                .setTimeout(60)
                .build();
            transaction.sign(sourceKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`XLM reward sent: ${result.hash}`);
            return { success: true, txHash: result.hash };
        }
        catch (error) {
            this.logger.error(`XLM reward error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async mintNFT(userPublicKey, userSecretKey, lessonTitle, lessonId) {
        try {
            const userKeypair = StellarSdk.Keypair.fromSecret(userSecretKey);
            const userAccount = await this.server.loadAccount(userPublicKey);
            const sanitized = lessonTitle
                .replace(/[^A-Z0-9]/gi, '')
                .toUpperCase()
                .substring(0, 8);
            const assetCode = `TNL${sanitized}`.substring(0, 12);
            const transaction = new StellarSdk.TransactionBuilder(userAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(StellarSdk.Operation.manageData({
                name: `TONALLI_CERT`,
                value: Buffer.from(JSON.stringify({
                    lesson: lessonId,
                    title: lessonTitle,
                    platform: 'Tonalli',
                    issuedAt: new Date().toISOString(),
                }).substring(0, 64)),
            }))
                .addMemo(StellarSdk.Memo.text('Tonalli NFT Certificate'))
                .setTimeout(60)
                .build();
            transaction.sign(userKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`NFT minted for lesson ${lessonId}: ${result.hash}`);
            return {
                success: true,
                txHash: result.hash,
                assetCode: assetCode,
                issuerPublicKey: userPublicKey,
            };
        }
        catch (error) {
            this.logger.error(`NFT mint error: ${error.message}`);
            return {
                success: false,
                txHash: `SIMULATED_${Date.now()}_${lessonId.substring(0, 8)}`,
                assetCode: `TNLCERT`,
                issuerPublicKey: userPublicKey,
                error: error.message,
            };
        }
    }
    async sendRewardFromAdmin(toPublicKey, amount) {
        if (!this.rewardPoolSecret) {
            this.logger.warn('REWARD_POOL_SECRET not set — simulating reward transfer');
            return {
                success: true,
                txHash: `SIMULATED_ADMIN_REWARD_${Date.now()}`,
            };
        }
        return this.sendXLMReward(this.rewardPoolSecret, toPublicKey, amount);
    }
    async mintNFTFromAdmin(userPublicKey, lessonTitle, lessonId) {
        if (!this.rewardPoolSecret) {
            this.logger.warn('REWARD_POOL_SECRET not set — simulating NFT mint');
            return {
                success: true,
                txHash: `SIMULATED_NFT_${Date.now()}_${lessonId.substring(0, 8)}`,
                assetCode: 'TNLCERT',
                issuerPublicKey: userPublicKey,
            };
        }
        try {
            const adminKeypair = StellarSdk.Keypair.fromSecret(this.rewardPoolSecret);
            const adminAccount = await this.server.loadAccount(adminKeypair.publicKey());
            const sanitized = lessonTitle
                .replace(/[^A-Z0-9]/gi, '')
                .toUpperCase()
                .substring(0, 8);
            const assetCode = `TNL${sanitized}`.substring(0, 12);
            const transaction = new StellarSdk.TransactionBuilder(adminAccount, {
                fee: StellarSdk.BASE_FEE,
                networkPassphrase: this.networkPassphrase,
            })
                .addOperation(StellarSdk.Operation.manageData({
                name: `TONALLI_CERT_${lessonId.substring(0, 20)}`,
                value: Buffer.from(JSON.stringify({
                    lesson: lessonId,
                    title: lessonTitle,
                    owner: userPublicKey,
                    platform: 'Tonalli',
                    issuedAt: new Date().toISOString(),
                }).substring(0, 64)),
            }))
                .addMemo(StellarSdk.Memo.text('Tonalli NFT Certificate'))
                .setTimeout(60)
                .build();
            transaction.sign(adminKeypair);
            const result = await this.server.submitTransaction(transaction);
            this.logger.log(`NFT minted (admin) for lesson ${lessonId}: ${result.hash}`);
            return {
                success: true,
                txHash: result.hash,
                assetCode,
                issuerPublicKey: adminKeypair.publicKey(),
            };
        }
        catch (error) {
            this.logger.error(`Admin NFT mint error: ${error.message}`);
            return {
                success: false,
                txHash: `SIMULATED_NFT_${Date.now()}_${lessonId.substring(0, 8)}`,
                assetCode: 'TNLCERT',
                issuerPublicKey: userPublicKey,
                error: error.message,
            };
        }
    }
    async ensureAccountFunded(publicKey) {
        const balance = await this.getBalance(publicKey);
        if (parseFloat(balance) < 1) {
            const result = await this.fundWithFriendbot(publicKey);
            return result.success;
        }
        return true;
    }
};
exports.StellarService = StellarService;
exports.StellarService = StellarService = StellarService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StellarService);
//# sourceMappingURL=stellar.service.js.map