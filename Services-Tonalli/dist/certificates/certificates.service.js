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
var CertificatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const acta_certificate_entity_1 = require("./entities/acta-certificate.entity");
const user_entity_1 = require("../users/entities/user.entity");
const acta_service_1 = require("../acta/acta.service");
let CertificatesService = CertificatesService_1 = class CertificatesService {
    certRepo;
    usersRepo;
    actaService;
    logger = new common_1.Logger(CertificatesService_1.name);
    constructor(certRepo, usersRepo, actaService) {
        this.certRepo = certRepo;
        this.usersRepo = usersRepo;
        this.actaService = actaService;
    }
    async issueActaCertificate(data) {
        const { txId, vcId } = await this.actaService.issueCredential(data.userId, data.chapterId, data.chapterTitle, data.examScore);
        const cert = this.certRepo.create({
            userId: data.userId,
            chapterId: data.chapterId,
            chapterTitle: data.chapterTitle,
            actaVcId: vcId,
            txHash: txId,
            examScore: data.examScore,
            type: 'official',
            status: 'issued',
        });
        const saved = await this.certRepo.save(cert);
        this.logger.log(`[ACTA] Certificate issued: vcId=${vcId}, txId=${txId}, user=${data.userId}`);
        return {
            id: saved.id,
            chapterId: saved.chapterId,
            chapterTitle: saved.chapterTitle,
            actaVcId: saved.actaVcId,
            txHash: saved.txHash,
            examScore: saved.examScore,
            status: saved.status,
            type: saved.type,
            issuedAt: saved.issuedAt,
            stellarExplorerUrl: saved.txHash
                ? `https://stellar.expert/explorer/testnet/tx/${saved.txHash}`
                : null,
        };
    }
    async storeCertificate(data) {
        const cert = this.certRepo.create({
            ...data,
            status: 'issued',
        });
        return this.certRepo.save(cert);
    }
    async getUserCertificates(userId) {
        const certs = await this.certRepo.find({
            where: { userId },
            order: { issuedAt: 'DESC' },
        });
        return certs.map((c) => ({
            id: c.id,
            chapterId: c.chapterId,
            chapterTitle: c.chapterTitle,
            actaVcId: c.actaVcId,
            txHash: c.txHash,
            examScore: c.examScore,
            status: c.status,
            type: c.type,
            issuedAt: c.issuedAt,
            stellarExplorerUrl: c.txHash
                ? `https://stellar.expert/explorer/testnet/tx/${c.txHash}`
                : null,
        }));
    }
    async verifyCertificate(actaVcId) {
        const cert = await this.certRepo.findOne({
            where: { actaVcId },
            relations: ['user'],
        });
        if (!cert)
            throw new common_1.NotFoundException('Certificate not found');
        let onChainStatus = { status: 'unknown' };
        try {
            onChainStatus = await this.actaService.verifyCredential(actaVcId);
        }
        catch {
        }
        return {
            valid: cert.status === 'issued',
            onChainStatus: onChainStatus.status,
            certificate: {
                id: cert.id,
                chapterTitle: cert.chapterTitle,
                username: cert.user?.username,
                examScore: cert.examScore,
                issuedAt: cert.issuedAt,
                txHash: cert.txHash,
                stellarExplorerUrl: cert.txHash
                    ? `https://stellar.expert/explorer/testnet/tx/${cert.txHash}`
                    : null,
            },
        };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = CertificatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(acta_certificate_entity_1.ActaCertificate)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        acta_service_1.ActaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map