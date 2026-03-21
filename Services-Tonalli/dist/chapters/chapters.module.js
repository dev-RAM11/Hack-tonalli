"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChaptersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chapter_entity_1 = require("./entities/chapter.entity");
const chapter_module_entity_1 = require("./entities/chapter-module.entity");
const chapter_progress_entity_1 = require("./entities/chapter-progress.entity");
const chapter_question_entity_1 = require("./entities/chapter-question.entity");
const chapters_service_1 = require("./chapters.service");
const chapters_controller_1 = require("./chapters.controller");
const user_entity_1 = require("../users/entities/user.entity");
const stellar_module_1 = require("../stellar/stellar.module");
let ChaptersModule = class ChaptersModule {
};
exports.ChaptersModule = ChaptersModule;
exports.ChaptersModule = ChaptersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([chapter_entity_1.Chapter, chapter_module_entity_1.ChapterModule, chapter_progress_entity_1.ChapterProgress, chapter_question_entity_1.ChapterQuestion, user_entity_1.User]),
            stellar_module_1.StellarModule,
        ],
        controllers: [chapters_controller_1.ChaptersController],
        providers: [chapters_service_1.ChaptersService],
        exports: [chapters_service_1.ChaptersService],
    })
], ChaptersModule);
//# sourceMappingURL=chapters.module.js.map