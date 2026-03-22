import { Repository } from 'typeorm';
import { ActaCertificate } from './entities/acta-certificate.entity';
import { User } from '../users/entities/user.entity';
import { ActaService } from '../acta/acta.service';
export declare class CertificatesService {
    private readonly certRepo;
    private readonly usersRepo;
    private readonly actaService;
    private readonly logger;
    constructor(certRepo: Repository<ActaCertificate>, usersRepo: Repository<User>, actaService: ActaService);
    issueActaCertificate(data: {
        userId: string;
        chapterId: string;
        chapterTitle: string;
        examScore: number;
    }): Promise<{
        id: string;
        chapterId: string;
        chapterTitle: string;
        actaVcId: string;
        txHash: string;
        examScore: number;
        status: "issued" | "pending" | "failed";
        type: "official" | "achievement";
        issuedAt: Date;
        stellarExplorerUrl: string | null;
    }>;
    storeCertificate(data: {
        userId: string;
        chapterId: string;
        chapterTitle: string;
        actaVcId: string;
        txHash: string;
        examScore: number;
        type: 'official' | 'achievement';
    }): Promise<ActaCertificate>;
    getUserCertificates(userId: string): Promise<{
        id: string;
        chapterId: string;
        chapterTitle: string;
        actaVcId: string;
        txHash: string;
        examScore: number;
        status: "issued" | "pending" | "failed";
        type: "official" | "achievement";
        issuedAt: Date;
        stellarExplorerUrl: string | null;
    }[]>;
    verifyCertificate(actaVcId: string): Promise<{
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
