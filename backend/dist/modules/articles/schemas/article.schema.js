var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ArticleStatus } from '../../../common/enums/article-status.enum.js';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';
import { User } from '../../users/schemas/user.schema.js';
let ArticleAnalysis = class ArticleAnalysis {
    practice;
    claim;
    outcome;
    researchMethod;
    participantType;
    summary;
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "practice", void 0);
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "claim", void 0);
__decorate([
    Prop({ enum: EvidenceOutcome }),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "outcome", void 0);
__decorate([
    Prop({ enum: ResearchMethod }),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "researchMethod", void 0);
__decorate([
    Prop({ enum: ParticipantType }),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "participantType", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], ArticleAnalysis.prototype, "summary", void 0);
ArticleAnalysis = __decorate([
    Schema({ _id: false })
], ArticleAnalysis);
export { ArticleAnalysis };
const ArticleAnalysisSchema = SchemaFactory.createForClass(ArticleAnalysis);
let Article = class Article extends Document {
    title;
    authors;
    journalOrConference;
    publicationYear;
    volume;
    issue;
    pages;
    doi;
    submitter;
    status;
    moderationNote;
    moderatedBy;
    moderatedAt;
    analyst;
    analysisCompletedAt;
    analysis;
    ratingCount;
    ratingTotal;
};
__decorate([
    Prop({ required: true }),
    __metadata("design:type", String)
], Article.prototype, "title", void 0);
__decorate([
    Prop({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Article.prototype, "authors", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "journalOrConference", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Number)
], Article.prototype, "publicationYear", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "volume", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "issue", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "pages", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "doi", void 0);
__decorate([
    Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true }),
    __metadata("design:type", Types.ObjectId)
], Article.prototype, "submitter", void 0);
__decorate([
    Prop({ enum: ArticleStatus, default: ArticleStatus.Submitted }),
    __metadata("design:type", String)
], Article.prototype, "status", void 0);
__decorate([
    Prop(),
    __metadata("design:type", String)
], Article.prototype, "moderationNote", void 0);
__decorate([
    Prop({ type: SchemaTypes.ObjectId, ref: User.name }),
    __metadata("design:type", Types.ObjectId)
], Article.prototype, "moderatedBy", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Article.prototype, "moderatedAt", void 0);
__decorate([
    Prop({ type: SchemaTypes.ObjectId, ref: User.name }),
    __metadata("design:type", Types.ObjectId)
], Article.prototype, "analyst", void 0);
__decorate([
    Prop(),
    __metadata("design:type", Date)
], Article.prototype, "analysisCompletedAt", void 0);
__decorate([
    Prop({ type: ArticleAnalysisSchema }),
    __metadata("design:type", ArticleAnalysis)
], Article.prototype, "analysis", void 0);
__decorate([
    Prop({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "ratingCount", void 0);
__decorate([
    Prop({ default: 0 }),
    __metadata("design:type", Number)
], Article.prototype, "ratingTotal", void 0);
Article = __decorate([
    Schema({ timestamps: true })
], Article);
export { Article };
export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.set('toJSON', {
    versionKey: false
});
//# sourceMappingURL=article.schema.js.map