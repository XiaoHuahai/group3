var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { Article, ArticleSchema } from './schemas/article.schema.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
let ArticlesModule = class ArticlesModule {
};
ArticlesModule = __decorate([
    Module({
        imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
        controllers: [ArticlesController],
        providers: [ArticlesService, JwtAuthGuard, RolesGuard],
        exports: [ArticlesService]
    })
], ArticlesModule);
export { ArticlesModule };
//# sourceMappingURL=articles.module.js.map