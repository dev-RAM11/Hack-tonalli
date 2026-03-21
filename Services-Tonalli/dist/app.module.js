"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_1 = require("@nestjs/schedule");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const lessons_module_1 = require("./lessons/lessons.module");
const stellar_module_1 = require("./stellar/stellar.module");
const progress_module_1 = require("./progress/progress.module");
const chapters_module_1 = require("./chapters/chapters.module");
const podium_module_1 = require("./podium/podium.module");
const certificates_module_1 = require("./certificates/certificates.module");
const chapter_entity_1 = require("./chapters/entities/chapter.entity");
const chapter_module_entity_1 = require("./chapters/entities/chapter-module.entity");
const chapter_progress_entity_1 = require("./chapters/entities/chapter-progress.entity");
const chapter_question_entity_1 = require("./chapters/entities/chapter-question.entity");
const weekly_score_entity_1 = require("./podium/entities/weekly-score.entity");
const podium_reward_entity_1 = require("./podium/entities/podium-reward.entity");
const acta_certificate_entity_1 = require("./certificates/entities/acta-certificate.entity");
const user_entity_1 = require("./users/entities/user.entity");
const lesson_entity_1 = require("./lessons/entities/lesson.entity");
const quiz_entity_1 = require("./lessons/entities/quiz.entity");
const progress_entity_1 = require("./progress/entities/progress.entity");
const nft_certificate_entity_1 = require("./progress/entities/nft-certificate.entity");
const streak_entity_1 = require("./users/entities/streak.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            schedule_1.ScheduleModule.forRoot(),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT || '3306'),
                    username: process.env.DB_USER || 'root',
                    password: process.env.DB_PASS || '',
                    database: process.env.DB_NAME || 'tonalli',
                    entities: [user_entity_1.User, lesson_entity_1.Lesson, quiz_entity_1.Quiz, progress_entity_1.Progress, nft_certificate_entity_1.NFTCertificate, streak_entity_1.Streak, chapter_entity_1.Chapter, chapter_module_entity_1.ChapterModule, chapter_progress_entity_1.ChapterProgress, chapter_question_entity_1.ChapterQuestion, weekly_score_entity_1.WeeklyScore, podium_reward_entity_1.PodiumReward, acta_certificate_entity_1.ActaCertificate],
                    synchronize: true,
                    logging: false,
                    charset: 'utf8mb4',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            lessons_module_1.LessonsModule,
            stellar_module_1.StellarModule,
            progress_module_1.ProgressModule,
            chapters_module_1.ChaptersModule,
            podium_module_1.PodiumModule,
            certificates_module_1.CertificatesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map