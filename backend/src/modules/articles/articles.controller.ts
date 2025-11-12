import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards
} from '@nestjs/common';
import { ArticlesService } from './articles.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { ModerateArticleDto } from './dto/moderate-article.dto.js';
import { UpdateAnalysisDto } from './dto/update-analysis.dto.js';
import { SearchArticlesDto } from './dto/search-articles.dto.js';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('submit')
  @Roles(Role.Submitter, Role.Moderator, Role.Analyst, Role.Admin)
  submit(@Request() req: any, @Body() dto: CreateArticleDto) {
    return this.articlesService.submit(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('mine')
  @Roles(Role.Submitter, Role.Moderator, Role.Analyst, Role.Admin)
  mine(@Request() req: any) {
    return this.articlesService.listBySubmitter(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('moderation/pending')
  @Roles(Role.Moderator, Role.Admin)
  moderationQueue() {
    return this.articlesService.listPendingModeration();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/moderate')
  @Roles(Role.Moderator, Role.Admin)
  moderate(@Param('id') id: string, @Request() req: any, @Body() dto: ModerateArticleDto) {
    return this.articlesService.moderate(id, req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('analysis/pending')
  @Roles(Role.Analyst, Role.Admin)
  analysisQueue() {
    return this.articlesService.listPendingAnalysis();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/analysis')
  @Roles(Role.Analyst, Role.Admin)
  analyse(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateAnalysisDto) {
    return this.articlesService.recordAnalysis(id, req.user.userId, dto);
  }

  @Get('search')
  search(@Query() query: SearchArticlesDto) {
    return this.articlesService.search(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findPublishedById(id);
  }
}


