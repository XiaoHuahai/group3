var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/enums/role.enum.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { ModerateArticleDto } from './dto/moderate-article.dto.js';
import { UpdateAnalysisDto } from './dto/update-analysis.dto.js';
import { SearchArticlesDto } from './dto/search-articles.dto.js';
let ArticlesController = class ArticlesController {
    articlesService;
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    submit(req, dto) {
        return this.articlesService.submit(req.user.userId, dto);
    }
    mine(req) {
        return this.articlesService.listBySubmitter(req.user.userId);
    }
    moderationQueue() {
        return this.articlesService.listPendingModeration();
    }
    moderate(id, req, dto) {
        return this.articlesService.moderate(id, req.user.userId, dto);
    }
    analysisQueue() {
        return this.articlesService.listPendingAnalysis();
    }
    analyse(id, req, dto) {
        return this.articlesService.recordAnalysis(id, req.user.userId, dto);
    }
    search(query) {
        return this.articlesService.search(query);
    }
    findOne(id) {
        return this.articlesService.findPublishedById(id);
    }
};
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Post('submit'),
    Roles(Role.Submitter, Role.Moderator, Role.Analyst, Role.Admin),
    __param(0, Request()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "submit", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('mine'),
    Roles(Role.Submitter, Role.Moderator, Role.Analyst, Role.Admin),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "mine", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('moderation/pending'),
    Roles(Role.Moderator, Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "moderationQueue", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Patch(':id/moderate'),
    Roles(Role.Moderator, Role.Admin),
    __param(0, Param('id')),
    __param(1, Request()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, ModerateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "moderate", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Get('analysis/pending'),
    Roles(Role.Analyst, Role.Admin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "analysisQueue", null);
__decorate([
    UseGuards(JwtAuthGuard, RolesGuard),
    Patch(':id/analysis'),
    Roles(Role.Analyst, Role.Admin),
    __param(0, Param('id')),
    __param(1, Request()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateAnalysisDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "analyse", null);
__decorate([
    Get('search'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchArticlesDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "search", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findOne", null);
ArticlesController = __decorate([
    Controller('articles'),
    __metadata("design:paramtypes", [ArticlesService])
], ArticlesController);
export { ArticlesController };
//# sourceMappingURL=articles.controller.js.map