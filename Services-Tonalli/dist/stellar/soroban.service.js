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
var SorobanService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SorobanService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
let SorobanService = SorobanService_1 = class SorobanService {
    configService;
    logger = new common_1.Logger(SorobanService_1.name);
    rpc;
    adminKeypair;
    network;
    networkPassphrase;
    nftContractId;
    rewardsContractId;
    tokenContractId;
    podiumNftContractId;
    constructor(configService) {
        this.configService = configService;
        const horizonUrl = this.configService.get('STELLAR_SOROBAN_URL') ||
            'https://soroban-testnet.stellar.org';
        this.rpc = new stellar_sdk_1.rpc.Server(horizonUrl, { allowHttp: false });
        const adminSecret = this.configService.get('STELLAR_ADMIN_SECRET');
        if (adminSecret) {
            this.adminKeypair = stellar_sdk_1.Keypair.fromSecret(adminSecret);
        }
        else {
            this.adminKeypair = stellar_sdk_1.Keypair.random();
            this.logger.warn(`No STELLAR_ADMIN_SECRET set. Using random keypair: ${this.adminKeypair.publicKey()}`);
        }
        this.network = this.configService.get('STELLAR_NETWORK') || 'testnet';
        this.networkPassphrase =
            this.network === 'mainnet' ? stellar_sdk_1.Networks.PUBLIC : stellar_sdk_1.Networks.TESTNET;
        this.nftContractId = this.configService.get('NFT_CONTRACT_ID') || '';
        this.rewardsContractId =
            this.configService.get('REWARDS_CONTRACT_ID') || '';
        this.tokenContractId =
            this.configService.get('TOKEN_CONTRACT_ID') || '';
        this.podiumNftContractId =
            this.configService.get('PODIUM_NFT_CONTRACT_ID') || '';
    }
    async mintCertificate(params) {
        if (!this.nftContractId) {
            this.logger.warn('NFT_CONTRACT_ID not set — using mock response');
            return this.mockMintCertificate(params);
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.nftContractId);
            const metadataUri = params.metadataUri ||
                `https://tonalli.app/certificates/${params.lessonId}`;
            const operation = contract.call('mint', new stellar_sdk_1.Address(params.userPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(params.lessonId, { type: 'string' }), (0, stellar_sdk_1.nativeToScVal)(params.moduleId, { type: 'string' }), (0, stellar_sdk_1.nativeToScVal)(params.username, { type: 'string' }), (0, stellar_sdk_1.nativeToScVal)(params.score, { type: 'u32' }), (0, stellar_sdk_1.nativeToScVal)(params.xpEarned, { type: 'u32' }), (0, stellar_sdk_1.nativeToScVal)(metadataUri, { type: 'string' }));
            const txHash = await this.submitSorobanTransaction(operation);
            const result = await this.getTransactionResult(txHash);
            const tokenId = (0, stellar_sdk_1.scValToNative)(result);
            this.logger.log(`NFT minted: token_id=${tokenId}, lesson=${params.lessonId}, tx=${txHash}`);
            return { tokenId, txHash, contractId: this.nftContractId };
        }
        catch (error) {
            this.logger.error('Failed to mint NFT certificate', error);
            return this.mockMintCertificate(params);
        }
    }
    async getCertificate(tokenId) {
        if (!this.nftContractId)
            return null;
        try {
            const contract = new stellar_sdk_1.Contract(this.nftContractId);
            const operation = contract.call('get_certificate', (0, stellar_sdk_1.nativeToScVal)(tokenId, { type: 'u64' }));
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return null;
            const native = (0, stellar_sdk_1.scValToNative)(result);
            return {
                tokenId: Number(native.token_id),
                owner: native.owner,
                lessonId: native.lesson_id,
                moduleId: native.module_id,
                username: native.username,
                score: native.score,
                xpEarned: native.xp_earned,
                issuedAt: Number(native.issued_at),
                metadataUri: native.metadata_uri,
            };
        }
        catch (error) {
            this.logger.error('Failed to get certificate', error);
            return null;
        }
    }
    async getUserCertificates(userPublicKey) {
        if (!this.nftContractId)
            return [];
        try {
            const contract = new stellar_sdk_1.Contract(this.nftContractId);
            const operation = contract.call('get_user_certificates', new stellar_sdk_1.Address(userPublicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return [];
            return (0, stellar_sdk_1.scValToNative)(result).map(Number);
        }
        catch (error) {
            this.logger.error('Failed to get user certificates', error);
            return [];
        }
    }
    async hasCertificate(userPublicKey, lessonId) {
        if (!this.nftContractId)
            return false;
        try {
            const contract = new stellar_sdk_1.Contract(this.nftContractId);
            const operation = contract.call('has_certificate', new stellar_sdk_1.Address(userPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(lessonId, { type: 'string' }));
            const result = await this.simulateSorobanCall(operation);
            return result ? (0, stellar_sdk_1.scValToNative)(result) : false;
        }
        catch (error) {
            this.logger.error('Failed to check certificate', error);
            return false;
        }
    }
    async rewardUser(params) {
        if (!this.rewardsContractId) {
            this.logger.warn('REWARDS_CONTRACT_ID not set — using mock response');
            return this.mockRewardUser(params);
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.rewardsContractId);
            const stroops = BigInt(Math.round(params.amountXlm * 10_000_000));
            const operation = contract.call('reward_user', new stellar_sdk_1.Address(params.userPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(params.lessonId, { type: 'string' }), (0, stellar_sdk_1.nativeToScVal)(stroops, { type: 'i128' }), (0, stellar_sdk_1.nativeToScVal)(params.score, { type: 'u32' }));
            const txHash = await this.submitSorobanTransaction(operation);
            const result = await this.getTransactionResult(txHash);
            const finalStroops = (0, stellar_sdk_1.scValToNative)(result);
            const finalXlm = Number(finalStroops) / 10_000_000;
            this.logger.log(`XLM reward sent: ${finalXlm} XLM to ${params.userPublicKey}, lesson=${params.lessonId}, tx=${txHash}`);
            return {
                amountXlm: finalXlm,
                amountStroops: Number(finalStroops),
                txHash,
            };
        }
        catch (error) {
            this.logger.error('Failed to reward user', error);
            return this.mockRewardUser(params);
        }
    }
    async mintTokens(toPublicKey, amount) {
        if (!this.tokenContractId) {
            this.logger.warn('TOKEN_CONTRACT_ID not set — using mock response');
            return this.mockMintTokens(toPublicKey, amount);
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.tokenContractId);
            const rawAmount = BigInt(Math.round(amount * 10_000_000));
            const operation = contract.call('mint', new stellar_sdk_1.Address(toPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(rawAmount, { type: 'i128' }));
            const txHash = await this.submitSorobanTransaction(operation);
            this.logger.log(`TNL minted: ${amount} TNL to ${toPublicKey}, tx=${txHash}`);
            return { success: true, txHash, amount };
        }
        catch (error) {
            this.logger.error('Failed to mint TNL tokens', error);
            return this.mockMintTokens(toPublicKey, amount);
        }
    }
    async getTokenBalance(publicKey) {
        if (!this.tokenContractId) {
            return 0;
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.tokenContractId);
            const operation = contract.call('balance', new stellar_sdk_1.Address(publicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return 0;
            const rawBalance = (0, stellar_sdk_1.scValToNative)(result);
            return Number(rawBalance) / 10_000_000;
        }
        catch (error) {
            this.logger.error('Failed to get TNL balance', error);
            return 0;
        }
    }
    async initializeToken() {
        if (!this.tokenContractId) {
            return { success: false };
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.tokenContractId);
            const operation = contract.call('initialize', new stellar_sdk_1.Address(this.adminKeypair.publicKey()).toScVal(), (0, stellar_sdk_1.nativeToScVal)(7, { type: 'u32' }), (0, stellar_sdk_1.nativeToScVal)('Tonalli', { type: 'string' }), (0, stellar_sdk_1.nativeToScVal)('TNL', { type: 'string' }));
            const txHash = await this.submitSorobanTransaction(operation);
            this.logger.log(`TNL token initialized, tx=${txHash}`);
            return { success: true, txHash };
        }
        catch (error) {
            this.logger.error('Failed to initialize TNL token', error);
            return { success: false };
        }
    }
    async mintPodiumNft(params) {
        if (!this.podiumNftContractId) {
            this.logger.warn('PODIUM_NFT_CONTRACT_ID not set — using mock response');
            return this.mockMintPodiumNft(params);
        }
        try {
            const contract = new stellar_sdk_1.Contract(this.podiumNftContractId);
            const operation = contract.call('mint_podium_nft', (0, stellar_sdk_1.nativeToScVal)(params.week, { type: 'string' }), new stellar_sdk_1.Address(params.userPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(params.rank, { type: 'u32' }), (0, stellar_sdk_1.nativeToScVal)(params.xlmRewardStroops, { type: 'u64' }), (0, stellar_sdk_1.nativeToScVal)(params.txHash, { type: 'string' }));
            const txHash = await this.submitSorobanTransaction(operation);
            this.logger.log(`Podium NFT minted: rank=${params.rank}, week=${params.week}, winner=${params.userPublicKey}, tx=${txHash}`);
            return { success: true, txHash };
        }
        catch (error) {
            this.logger.error('Failed to mint podium NFT', error);
            return this.mockMintPodiumNft(params);
        }
    }
    async getPodiumNft(week, userPublicKey) {
        if (!this.podiumNftContractId)
            return null;
        try {
            const contract = new stellar_sdk_1.Contract(this.podiumNftContractId);
            const operation = contract.call('get_podium_nft', (0, stellar_sdk_1.nativeToScVal)(week, { type: 'string' }), new stellar_sdk_1.Address(userPublicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return null;
            const native = (0, stellar_sdk_1.scValToNative)(result);
            if (!native)
                return null;
            return {
                rank: native.rank,
                xlmReward: Number(native.xlm_reward),
                week: native.week,
                txHash: native.tx_hash,
                issuedAt: Number(native.issued_at),
                owner: native.owner,
            };
        }
        catch (error) {
            this.logger.error('Failed to get podium NFT', error);
            return null;
        }
    }
    async hasPodiumNft(week, userPublicKey) {
        if (!this.podiumNftContractId)
            return false;
        try {
            const contract = new stellar_sdk_1.Contract(this.podiumNftContractId);
            const operation = contract.call('has_nft', (0, stellar_sdk_1.nativeToScVal)(week, { type: 'string' }), new stellar_sdk_1.Address(userPublicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            return result ? (0, stellar_sdk_1.scValToNative)(result) : false;
        }
        catch (error) {
            this.logger.error('Failed to check podium NFT', error);
            return false;
        }
    }
    async getRewardHistory(userPublicKey) {
        if (!this.rewardsContractId)
            return [];
        try {
            const contract = new stellar_sdk_1.Contract(this.rewardsContractId);
            const operation = contract.call('get_reward_history', new stellar_sdk_1.Address(userPublicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return [];
            const native = (0, stellar_sdk_1.scValToNative)(result);
            return native.map((r) => ({
                lessonId: r.lesson_id,
                amount: Number(r.amount),
                timestamp: Number(r.timestamp),
            }));
        }
        catch (error) {
            this.logger.error('Failed to get reward history', error);
            return [];
        }
    }
    async getUserTotalRewards(userPublicKey) {
        if (!this.rewardsContractId)
            return 0;
        try {
            const contract = new stellar_sdk_1.Contract(this.rewardsContractId);
            const operation = contract.call('get_user_total_rewards', new stellar_sdk_1.Address(userPublicKey).toScVal());
            const result = await this.simulateSorobanCall(operation);
            if (!result)
                return 0;
            return Number((0, stellar_sdk_1.scValToNative)(result));
        }
        catch (error) {
            this.logger.error('Failed to get user total rewards', error);
            return 0;
        }
    }
    async isLessonRewarded(userPublicKey, lessonId) {
        if (!this.rewardsContractId)
            return false;
        try {
            const contract = new stellar_sdk_1.Contract(this.rewardsContractId);
            const operation = contract.call('is_lesson_rewarded', new stellar_sdk_1.Address(userPublicKey).toScVal(), (0, stellar_sdk_1.nativeToScVal)(lessonId, { type: 'string' }));
            const result = await this.simulateSorobanCall(operation);
            return result ? (0, stellar_sdk_1.scValToNative)(result) : false;
        }
        catch (error) {
            this.logger.error('Failed to check lesson rewarded', error);
            return false;
        }
    }
    async submitSorobanTransaction(operation) {
        const adminAccount = await this.rpc.getAccount(this.adminKeypair.publicKey());
        const tx = new stellar_sdk_1.TransactionBuilder(adminAccount, {
            fee: stellar_sdk_1.BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(operation)
            .setTimeout(30)
            .build();
        const simResult = await this.rpc.simulateTransaction(tx);
        if (stellar_sdk_1.rpc.Api.isSimulationError(simResult)) {
            throw new Error(`Simulation failed: ${simResult.error}`);
        }
        const preparedTx = stellar_sdk_1.rpc.assembleTransaction(tx, simResult).build();
        preparedTx.sign(this.adminKeypair);
        const sendResult = await this.rpc.sendTransaction(preparedTx);
        if (sendResult.status === 'ERROR') {
            throw new Error(`Transaction failed: ${JSON.stringify(sendResult.errorResult)}`);
        }
        return await this.waitForTransaction(sendResult.hash);
    }
    async simulateSorobanCall(operation) {
        const adminAccount = await this.rpc.getAccount(this.adminKeypair.publicKey());
        const tx = new stellar_sdk_1.TransactionBuilder(adminAccount, {
            fee: stellar_sdk_1.BASE_FEE,
            networkPassphrase: this.networkPassphrase,
        })
            .addOperation(operation)
            .setTimeout(30)
            .build();
        const simResult = await this.rpc.simulateTransaction(tx);
        if (stellar_sdk_1.rpc.Api.isSimulationError(simResult)) {
            this.logger.error('Simulation error', simResult.error);
            return null;
        }
        const successResult = simResult;
        return successResult.result?.retval ?? null;
    }
    async waitForTransaction(hash, maxWait = 30) {
        let attempts = 0;
        while (attempts < maxWait) {
            const result = await this.rpc.getTransaction(hash);
            if (result.status === stellar_sdk_1.rpc.Api.GetTransactionStatus.SUCCESS) {
                return hash;
            }
            if (result.status === stellar_sdk_1.rpc.Api.GetTransactionStatus.FAILED) {
                throw new Error(`Transaction ${hash} failed`);
            }
            await new Promise((r) => setTimeout(r, 1000));
            attempts++;
        }
        throw new Error(`Transaction ${hash} timed out`);
    }
    async getTransactionResult(hash) {
        const result = await this.rpc.getTransaction(hash);
        if (result.status !== stellar_sdk_1.rpc.Api.GetTransactionStatus.SUCCESS) {
            throw new Error('Transaction not successful');
        }
        const successResult = result;
        return successResult.returnValue;
    }
    async mockMintCertificate(params) {
        const tokenId = Math.floor(Math.random() * 9000) + 1000;
        const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        this.logger.log(`[MOCK] NFT Certificate minted: token_id=${tokenId}, tx=${txHash}`);
        return {
            tokenId,
            txHash,
            contractId: 'MOCK_CONTRACT_' + this.network.toUpperCase(),
        };
    }
    async mockMintTokens(toPublicKey, amount) {
        const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        this.logger.log(`[MOCK] TNL mint: ${amount} TNL to ${toPublicKey}, tx=${txHash}`);
        return { success: true, txHash, amount };
    }
    async mockMintPodiumNft(params) {
        const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        this.logger.log(`[MOCK] Podium NFT minted: rank=${params.rank}, week=${params.week}, winner=${params.userPublicKey}, tx=${txHash}`);
        return { success: true, txHash };
    }
    async mockRewardUser(params) {
        const bonus = params.score === 100 ? params.amountXlm * 0.1 : 0;
        const finalXlm = params.amountXlm + bonus;
        const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        this.logger.log(`[MOCK] XLM reward: ${finalXlm} XLM to ${params.userPublicKey}, tx=${txHash}`);
        return {
            amountXlm: finalXlm,
            amountStroops: Math.round(finalXlm * 10_000_000),
            txHash,
        };
    }
};
exports.SorobanService = SorobanService;
exports.SorobanService = SorobanService = SorobanService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SorobanService);
//# sourceMappingURL=soroban.service.js.map