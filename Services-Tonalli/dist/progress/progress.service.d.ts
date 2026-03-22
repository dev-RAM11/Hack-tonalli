import { Repository } from 'typeorm';
import { Progress } from './entities/progress.entity';
import { NFTCertificate } from './entities/nft-certificate.entity';
import { UsersService } from '../users/users.service';
import { StellarService } from '../stellar/stellar.service';
import { SorobanService } from '../stellar/soroban.service';
import { Lesson } from '../lessons/entities/lesson.entity';
import { Quiz } from '../lessons/entities/quiz.entity';
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}
export declare class ProgressService {
    private readonly progressRepository;
    private readonly nftRepository;
    private readonly lessonRepository;
    private readonly quizRepository;
    private readonly usersService;
    private readonly stellarService;
    private readonly sorobanService;
    private readonly logger;
    constructor(progressRepository: Repository<Progress>, nftRepository: Repository<NFTCertificate>, lessonRepository: Repository<Lesson>, quizRepository: Repository<Quiz>, usersService: UsersService, stellarService: StellarService, sorobanService: SorobanService);
    submitQuiz(userId: string, lessonId: string, answers: {
        questionId: string;
        selectedIndex: number;
    }[]): Promise<any>;
    getUserProgress(userId: string): Promise<any[]>;
    getUserCertificates(userId: string): Promise<any[]>;
}
