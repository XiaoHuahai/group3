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
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Article } from './schemas/article.schema.js';
import { ArticleStatus } from '../../common/enums/article-status.enum.js';
let ArticlesService = class ArticlesService {
    articleModel;
    constructor(articleModel) {
        this.articleModel = articleModel;
    }
    async submit(submitterId, dto) {
        const created = new this.articleModel({
            ...dto,
            submitter: new Types.ObjectId(submitterId)
        });
        return created.save();
    }
    async listBySubmitter(submitterId) {
        return this.articleModel
            .find({ submitter: new Types.ObjectId(submitterId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async listPendingModeration() {
        return this.articleModel.find({ status: ArticleStatus.Submitted }).sort({ createdAt: 1 }).exec();
    }
    async listPendingAnalysis() {
        return this.articleModel
            .find({ status: ArticleStatus.ApprovedForAnalysis })
            .sort({ moderatedAt: 1 })
            .exec();
    }
    async moderate(articleId, moderatorId, dto) {
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
        }
        else if (dto.decision === 'reject') {
            article.status = ArticleStatus.Rejected;
            article.moderationNote = dto.note;
        }
        else {
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
    async recordAnalysis(articleId, analystId, dto) {
        const article = await this.articleModel.findById(articleId);
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        if (article.status !== ArticleStatus.ApprovedForAnalysis) {
            throw new BadRequestException('Article is not ready for analysis');
        }
        const analysis = {
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
    async search(dto) {
        // 搜索已审核通过或已发布的文章（审核通过后即可被搜索）
        const filter = {
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
    async findPublishedById(id) {
        return this.articleModel.findOne({ _id: id, status: ArticleStatus.Published }).exec();
    }
    async findById(id) {
        return this.articleModel.findById(id).exec();
    }
    async findByIdOrPublished(id, userId) {
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
    async update(articleId, userId, dto) {
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
    async delete(articleId, userId) {
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
};
ArticlesService = __decorate([
    Injectable(),
    __param(0, InjectModel(Article.name)),
    __metadata("design:paramtypes", [Model])
], ArticlesService);
export { ArticlesService };
//# sourceMappingURL=articles.service.js.map