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
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const certificates_service_1 = require("./certificates.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CertificatesController = class CertificatesController {
    certService;
    constructor(certService) {
        this.certService = certService;
    }
    getUserCertificates(req) {
        return this.certService.getUserCertificates(req.user.id);
    }
    issueActaCertificate(data, req) {
        return this.certService.issueActaCertificate({
            userId: req.user.id,
            chapterId: data.chapterId,
            chapterTitle: data.chapterTitle,
            examScore: data.examScore,
        });
    }
    storeCertificate(data, req) {
        return this.certService.storeCertificate({
            userId: req.user.id,
            chapterId: data.chapterId,
            chapterTitle: data.chapterTitle,
            actaVcId: data.actaVcId,
            txHash: data.txHash,
            examScore: data.examScore,
            type: data.type || 'official',
        });
    }
    verifyCertificate(vcId) {
        return this.certService.verifyCertificate(vcId);
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "getUserCertificates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('issue'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "issueActaCertificate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('store'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "storeCertificate", null);
__decorate([
    (0, common_1.Get)('verify'),
    __param(0, (0, common_1.Query)('vcId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificatesController.prototype, "verifyCertificate", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.Controller)('certificates'),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map