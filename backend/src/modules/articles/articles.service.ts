import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Article, ArticleAnalysis } from './schemas/article.schema.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { ArticleStatus } from '../../common/enums/article-status.enum.js';
import { ModerateArticleDto } from './dto/moderate-article.dto.js';
import { UpdateAnalysisDto } from './dto/update-analysis.dto.js';
import { SearchArticlesDto } from './dto/search-articles.dto.js';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private readonly articleModel: Model<Article>) {}

  async submit(submitterId: string, dto: CreateArticleDto): Promise<Article> {
    const created = new this.articleModel({
      ...dto,
      submitter: new Types.ObjectId(submitterId)
    });
    return created.save();
  }

  async listBySubmitter(submitterId: string): Promise<Article[]> {
    return this.articleModel
      .find({ submitter: new Types.ObjectId(submitterId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async listPendingModeration(): Promise<Article[]> {
    return this.articleModel.find({ status: ArticleStatus.Submitted }).sort({ createdAt: 1 }).exec();
  }

  async listPendingAnalysis(): Promise<Article[]> {
    return this.articleModel
      .find({ status: ArticleStatus.ApprovedForAnalysis })
      .sort({ moderatedAt: 1 })
      .exec();
  }

  async moderate(articleId: string, moderatorId: string, dto: ModerateArticleDto): Promise<Article> {
    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (article.status !== ArticleStatus.Submitted) {
      throw new BadRequestException('Article is not awaiting moderation');
    }
    if (dto.decision === 'approve') {
      article.status = ArticleStatus.ApprovedForAnalysis;
      article.moderationNote = dto.note;
    } else if (dto.decision === 'reject') {
      article.status = ArticleStatus.Rejected;
      article.moderationNote = dto.note;
    } else {
      throw new BadRequestException('Unknown decision');
    }
    article.moderatedBy = new Types.ObjectId(moderatorId);
    article.moderatedAt = new Date();
    if (article.status !== ArticleStatus.ApprovedForAnalysis) {
      article.analysis = undefined;
      article.analyst = undefined;
      article.analysisCompletedAt = undefined;
    }
    await article.save();
    return article;
  }

  async recordAnalysis(
    articleId: string,
    analystId: string,
    dto: UpdateAnalysisDto
  ): Promise<Article> {
    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    if (article.status !== ArticleStatus.ApprovedForAnalysis) {
      throw new BadRequestException('Article is not ready for analysis');
    }
    const analysis: ArticleAnalysis = {
      practice: dto.practice,
      claim: dto.claim,
      outcome: dto.outcome,
      researchMethod: dto.researchMethod,
      participantType: dto.participantType,
      summary: dto.summary
    };
    article.analysis = analysis;
    article.status = ArticleStatus.Published;
    article.analyst = new Types.ObjectId(analystId);
    article.analysisCompletedAt = new Date();
    await article.save();
    return article;
  }

  async getSearchStats() {
    const total = await this.articleModel.countDocuments().exec();
    const published = await this.articleModel.countDocuments({ status: ArticleStatus.Published }).exec();
    const submitted = await this.articleModel.countDocuments({ status: ArticleStatus.Submitted }).exec();
    const approved = await this.articleModel.countDocuments({ status: ArticleStatus.ApprovedForAnalysis }).exec();
    const rejected = await this.articleModel.countDocuments({ status: ArticleStatus.Rejected }).exec();
    
    return {
      total,
      byStatus: {
        Published: published,
        Submitted: submitted,
        ApprovedForAnalysis: approved,
        Rejected: rejected
      }
    };
  }

  async search(dto: SearchArticlesDto) {
    // 搜索已审核通过或已发布的文章（审核通过后即可被搜索）
    const filter: FilterQuery<Article> = {
      status: { $in: [ArticleStatus.ApprovedForAnalysis, ArticleStatus.Published] }
    };
    if (dto.practice) {
      filter['analysis.practice'] = dto.practice;
    }
    if (dto.claim) {
      filter['analysis.claim'] = dto.claim;
    }
    if (dto.outcome) {
      filter['analysis.outcome'] = dto.outcome;
    }
    if (dto.researchMethod) {
      filter['analysis.researchMethod'] = dto.researchMethod;
    }
    if (dto.participantType) {
      filter['analysis.participantType'] = dto.participantType;
    }
    if (dto.yearFrom || dto.yearTo) {
      filter.publicationYear = {};
      if (dto.yearFrom) {
        filter.publicationYear.$gte = dto.yearFrom;
      }
      if (dto.yearTo) {
        filter.publicationYear.$lte = dto.yearTo;
      }
    }
    // 支持独立的标题和作者搜索
    if (dto.title) {
      filter.title = { $regex: dto.title, $options: 'i' };
    }
    if (dto.author) {
      filter.authors = { $in: [new RegExp(dto.author, 'i')] };
    }
    // 保留原有的 searchTerm 支持（向后兼容）
    if (dto.searchTerm && !dto.title && !dto.author) {
      filter.$or = [
        { title: { $regex: dto.searchTerm, $options: 'i' } },
        { authors: { $in: [new RegExp(dto.searchTerm, 'i')] } },
        { journalOrConference: { $regex: dto.searchTerm, $options: 'i' } }
      ];
    }
    return this.articleModel
      .find(filter)
      .sort({ publicationYear: -1, createdAt: -1 })
      .lean()
      .exec();
  }

  async findPublishedById(id: string): Promise<Article | null> {
    return this.articleModel.findOne({ _id: id, status: ArticleStatus.Published }).exec();
  }

  async findById(id: string): Promise<Article | null> {
    return this.articleModel.findById(id).exec();
  }

  async findByIdOrPublished(id: string, userId?: string): Promise<Article | null> {
    const article = await this.articleModel.findById(id).exec();
    if (!article) {
      return null;
    }
    // 如果文章已发布，任何人都可以查看
    if (article.status === ArticleStatus.Published) {
      return article;
    }
    // 如果文章未发布，只有提交者可以查看
    if (userId && article.submitter.toString() === userId) {
      return article;
    }
    // 其他情况返回 null
    return null;
  }

  async update(articleId: string, userId: string, dto: CreateArticleDto): Promise<Article> {
    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    // 只有提交者或管理员可以更新
    if (article.submitter.toString() !== userId) {
      throw new BadRequestException('You can only update your own articles');
    }
    // 只有已提交状态的文章可以更新
    if (article.status !== ArticleStatus.Submitted) {
      throw new BadRequestException('Only submitted articles can be updated');
    }
    Object.assign(article, dto);
    return article.save();
  }

  async delete(articleId: string, userId: string): Promise<void> {
    const article = await this.articleModel.findById(articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    // 只有提交者或管理员可以删除
    if (article.submitter.toString() !== userId) {
      throw new BadRequestException('You can only delete your own articles');
    }
    // 只有已提交状态的文章可以删除
    if (article.status !== ArticleStatus.Submitted) {
      throw new BadRequestException('Only submitted articles can be deleted');
    }
    await this.articleModel.findByIdAndDelete(articleId);
  }
}


