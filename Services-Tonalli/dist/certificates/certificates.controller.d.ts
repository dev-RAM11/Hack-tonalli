import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly certService;
    constructor(certService: CertificatesService);
    getUserCertificates(req: any): Promise<{
        id: string;
        chapterId: string;
        chapterTitle: string;
        actaVcId: string;
        txHash: string;
        examScore: number;
        status: "pending" | "issued" | "failed";
        type: "official" | "achievement";
        issuedAt: Date;
        stellarExplorerUrl: string | null;
    }[]>;
    issueActaCertificate(data: {
        chapterId: string;
        chapterTitle: string;
        examScore: number;
    }, req: any): Promise<{
        id: string;
        chapterId: string;
        chapterTitle: string;
        actaVcId: string;
        txHash: string;
        examScore: number;
        status: "pending" | "issued" | "failed";
        type: "official" | "achievement";
        issuedAt: Date;
        stellarExplorerUrl: string | null;
    }>;
    storeCertificate(data: any, req: any): Promise<import("./entities/acta-certificate.entity").ActaCertificate>;
    verifyCertificate(vcId: string): Promise<{
        valid: boolean;
        onChainStatus: string;
        certificate: {
            id: string;
            chapterTitle: string;
            username: string;
            examScore: number;
            issuedAt: Date;
            txHash: string;
            stellarExplorerUrl: string | null;
        };
    }>;
}
