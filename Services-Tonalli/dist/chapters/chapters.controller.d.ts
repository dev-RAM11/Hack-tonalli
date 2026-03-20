import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
export declare class ChaptersController {
    private readonly chaptersService;
    constructor(chaptersService: ChaptersService);
    findPublished(req: any): Promise<any[]>;
    findOne(id: string): Promise<import("./entities/chapter.entity").Chapter>;
    getChapterWithProgress(id: string, req: any): Promise<{
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
            lockedUntil: string | null;
        }[];
        completionPercent: number;
        isPremium: boolean;
        accessible: boolean;
        lockedReason: string | null;
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
    completeInfoModule(moduleId: string, req: any): Promise<import("./entities/chapter-progress.entity").ChapterProgress>;
    updateVideoProgress(moduleId: string, percent: number, req: any): Promise<import("./entities/chapter-progress.entity").ChapterProgress>;
    getQuizQuestions(moduleId: string, req: any): Promise<{
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
    submitQuiz(moduleId: string, answers: {
        questionId: string;
        selectedIndex: number;
    }[], req: any): Promise<{
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
        lockedUntil: string | null;
        moduleCompleted: boolean;
        message: string;
    }>;
    reportQuizAbandon(moduleId: string, reason: string, req: any): Promise<{
        penalized: boolean;
        reason: string;
        livesRemaining?: undefined;
        lockedUntil?: undefined;
        message?: undefined;
    } | {
        penalized: boolean;
        reason: string;
        livesRemaining: number;
        lockedUntil: string | null;
        message: string;
    }>;
    unlockFinalExam(id: string, req: any): Promise<{
        unlocked: boolean;
        moduleId: string;
    }>;
    findAll(): Promise<import("./entities/chapter.entity").Chapter[]>;
    create(dto: CreateChapterDto): Promise<import("./entities/chapter.entity").Chapter>;
    update(id: string, dto: UpdateChapterDto): Promise<import("./entities/chapter.entity").Chapter>;
    updateModule(moduleId: string, data: any): Promise<import("./entities/chapter-module.entity").ChapterModule>;
    togglePublish(id: string): Promise<import("./entities/chapter.entity").Chapter>;
    releaseThisWeek(id: string): Promise<import("./entities/chapter.entity").Chapter>;
    setReleaseWeek(id: string, week: string): Promise<import("./entities/chapter.entity").Chapter>;
    remove(id: string): Promise<void>;
}
