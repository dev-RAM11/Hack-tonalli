import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chapter } from './entities/chapter.entity';
import { ChapterModule } from './entities/chapter-module.entity';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { ChapterQuestion } from './entities/chapter-question.entity';
import { ChaptersService } from './chapters.service';
import { ChaptersController } from './chapters.controller';
import { User } from '../users/entities/user.entity';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chapter, ChapterModule, ChapterProgress, ChapterQuestion, User]),
    StellarModule,
  ],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService],
})
export class ChaptersModule {}
