import { Repository } from 'typeorm';
import { Chapter } from './entities/chapter.entity';
import { ChapterModule } from './entities/chapter-module.entity';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { ChapterQuestion } from './entities/chapter-question.entity';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { User } from '../users/entities/user.entity';
import { SorobanService } from '../stellar/soroban.service';
export declare class ChaptersService {
    private readonly chaptersRepo;
    private readonly modulesRepo;
    private readonly progressRepo;
    private readonly questionsRepo;
    private readonly usersRepo;
    private readonly sorobanService;
    constructor(chaptersRepo: Repository<Chapter>, modulesRepo: Repository<ChapterModule>, progressRepo: Repository<ChapterProgress>, questionsRepo: Repository<ChapterQuestion>, usersRepo: Repository<User>, sorobanService: SorobanService);
    create(dto: CreateChapterDto): Promise<Chapter>;
    getCurrentWeek(): string;
    getNextWeek(): string;
    findAll(): Promise<Chapter[]>;
    findAllPublished(): Promise<Chapter[]>;
    findPublishedForUser(userId: string): Promise<any[]>;
    findOne(id: string): Promise<Chapter>;
    update(id: string, dto: UpdateChapterDto): Promise<Chapter>;
    remove(id: string): Promise<void>;
    togglePublish(id: string): Promise<Chapter>;
    setReleaseWeek(id: string, week: string): Promise<Chapter>;
    releaseThisWeek(id: string): Promise<Chapter>;
    updateModule(moduleId: string, data: Partial<ChapterModule>): Promise<ChapterModule>;
    getModuleQuestions(moduleId: string): Promise<ChapterQuestion[]>;
    replaceModuleQuestions(moduleId: string, questions: {
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
    }[]): Promise<{
        success: boolean;
        count: number;
    }>;
    getChapterWithProgress(chapterId: string, userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        coverImage: string;
        moduleTag: string;
        xpReward: number;
        releaseWeek: string;
        modules: {
            id: string;
            type: "lesson" | "final_exam";
            order: number;
            title: string;
            xpReward: number;
            unlocked: boolean;
            completed: boolean;
            sections: {
                info: {
                    completed: boolean;
                    hasContent: boolean;
                };
                video: {
                    completed: boolean;
                    progress: number;
                    hasVideo: boolean;
                };
                quiz: {
                    completed: boolean;
                    score: number;
                    attempts: number;
                };
            } | undefined;
            score: number;
            attempts: number;
            livesRemaining: number;
            lockedUntil: null;
        }[];
        completionPercent: number;
        plan: "free" | "pro" | "max";
        accessible: boolean;
        lockedReason: string | null;
    }>;
    completeInfoModule(moduleId: string, userId: string): Promise<ChapterProgress>;
    updateVideoProgress(moduleId: string, userId: string, percent: number): Promise<ChapterProgress>;
    getQuizQuestions(moduleId: string, userId: string): Promise<{
        moduleId: string;
        chapterId: string;
        type: "lesson" | "final_exam";
        passingScore: number;
        totalQuestions: number;
        questions: {
            id: string;
            question: string;
            options: string[];
        }[];
    }>;
    submitQuiz(moduleId: string, userId: string, answers: {
        questionId: string;
        selectedIndex: number;
    }[]): Promise<{
        score: number;
        passed: boolean;
        correctCount: number;
        totalQuestions: number;
        results: ({
            questionId: string;
            correct: boolean;
            correctIndex?: undefined;
            explanation?: undefined;
        } | {
            questionId: string;
            correct: boolean;
            correctIndex: number;
            explanation: string;
        })[];
        xpEarned: number;
        livesRemaining: number;
        moduleCompleted: boolean;
        mustRedoModule: boolean;
        message: string;
    }>;
    reportQuizAbandon(moduleId: string, userId: string, reason: string): Promise<{
        penalized: boolean;
        reason: string;
        livesRemaining?: undefined;
        mustRedoModule?: undefined;
        message?: undefined;
    } | {
        penalized: boolean;
        reason: string;
        livesRemaining: number;
        mustRedoModule: boolean;
        message: string;
    }>;
    unlockFinalExam(chapterId: string, userId: string): Promise<{
        unlocked: boolean;
        moduleId: string;
        certCost: number;
    }>;
    getModuleContent(moduleId: string): Promise<{
        id: string;
        type: "lesson" | "final_exam";
        order: number;
        title: string;
        content: string;
        videoUrl: string;
        hasQuiz: boolean;
    }>;
    private getOrCreateProgress;
}
