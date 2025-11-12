import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from './articles.controller.js';
import { ArticlesService } from './articles.service.js';
import { Article, ArticleSchema } from './schemas/article.schema.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])],
  controllers: [ArticlesController],
  providers: [ArticlesService, JwtAuthGuard, RolesGuard],
  exports: [ArticlesService]
})
export class ArticlesModule {}



