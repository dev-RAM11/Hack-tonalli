import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Req,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  // ── Public (any authenticated user) ──────────────────────────────────────

  /** GET /api/chapters — returns published chapters filtered by user plan + week */
  @UseGuards(JwtAuthGuard)
  @Get()
  findPublished(@Req() req: any) {
    return this.chaptersService.findPublishedForUser(req.user.id);
  }

  /** GET /api/chapters/:id — returns a single chapter with modules */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(id);
  }

  /** GET /api/chapters/:id/progress — chapter with user progress */
  @UseGuards(JwtAuthGuard)
  @Get(':id/progress')
  getChapterWithProgress(@Param('id') id: string, @Req() req: any) {
    return this.chaptersService.getChapterWithProgress(id, req.user.id);
  }

  /** GET /api/chapters/modules/:moduleId/content — get module info/video/quiz status */
  @UseGuards(JwtAuthGuard)
  @Get('modules/:moduleId/content')
  getModuleContent(@Param('moduleId') moduleId: string) {
    return this.chaptersService.getModuleContent(moduleId);
  }

  // ── Module progress endpoints ────────────────────────────────────────────

  /** POST /api/chapters/modules/:moduleId/complete-info — mark info module done */
  @UseGuards(JwtAuthGuard)
  @Post('modules/:moduleId/complete-info')
  completeInfoModule(@Param('moduleId') moduleId: string, @Req() req: any) {
    return this.chaptersService.completeInfoModule(moduleId, req.user.id);
  }

  /** POST /api/chapters/modules/:moduleId/video-progress — update video % */
  @UseGuards(JwtAuthGuard)
  @Post('modules/:moduleId/video-progress')
  updateVideoProgress(
    @Param('moduleId') moduleId: string,
    @Body('percent') percent: number,
    @Req() req: any,
  ) {
    return this.chaptersService.updateVideoProgress(moduleId, req.user.id, percent);
  }

  /** GET /api/chapters/modules/:moduleId/quiz — get quiz questions */
  @UseGuards(JwtAuthGuard)
  @Get('modules/:moduleId/quiz')
  getQuizQuestions(@Param('moduleId') moduleId: string, @Req() req: any) {
    return this.chaptersService.getQuizQuestions(moduleId, req.user.id);
  }

  /** POST /api/chapters/modules/:moduleId/quiz/submit — submit quiz answers */
  @UseGuards(JwtAuthGuard)
  @Post('modules/:moduleId/quiz/submit')
  submitQuiz(
    @Param('moduleId') moduleId: string,
    @Body('answers') answers: { questionId: string; selectedIndex: number }[],
    @Req() req: any,
  ) {
    return this.chaptersService.submitQuiz(moduleId, req.user.id, answers);
  }

  /** POST /api/chapters/modules/:moduleId/quiz/abandon — report cheating/abandon */
  @UseGuards(JwtAuthGuard)
  @Post('modules/:moduleId/quiz/abandon')
  reportQuizAbandon(
    @Param('moduleId') moduleId: string,
    @Body('reason') reason: string,
    @Req() req: any,
  ) {
    return this.chaptersService.reportQuizAbandon(moduleId, req.user.id, reason || 'tab_switch');
  }

  /** POST /api/chapters/:id/unlock-exam — Free user unlocks Module 4 */
  @UseGuards(JwtAuthGuard)
  @Post(':id/unlock-exam')
  unlockFinalExam(@Param('id') id: string, @Req() req: any) {
    return this.chaptersService.unlockFinalExam(id, req.user.id);
  }

  // ── Admin only ────────────────────────────────────────────────────────────

  /** GET /api/chapters/admin/all — all chapters including unpublished */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  findAll() {
    return this.chaptersService.findAll();
  }

  /** POST /api/chapters — create new chapter (auto-creates 4 modules) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateChapterDto) {
    return this.chaptersService.create(dto);
  }

  /** PATCH /api/chapters/:id — update chapter */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateChapterDto) {
    return this.chaptersService.update(id, dto);
  }

  /** PATCH /api/chapters/modules/:moduleId — update a module (content, questions, video) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('modules/:moduleId')
  updateModule(@Param('moduleId') moduleId: string, @Body() data: any) {
    return this.chaptersService.updateModule(moduleId, data);
  }

  /** PATCH /api/chapters/:id/publish — toggle published */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/publish')
  togglePublish(@Param('id') id: string) {
    return this.chaptersService.togglePublish(id);
  }

  /** PATCH /api/chapters/:id/release — release chapter for current week */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/release')
  releaseThisWeek(@Param('id') id: string) {
    return this.chaptersService.releaseThisWeek(id);
  }

  /** PATCH /api/chapters/:id/release-week — set specific release week */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':id/release-week')
  setReleaseWeek(@Param('id') id: string, @Body('week') week: string) {
    return this.chaptersService.setReleaseWeek(id, week);
  }

  /** DELETE /api/chapters/:id — delete chapter */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(id);
  }
}
