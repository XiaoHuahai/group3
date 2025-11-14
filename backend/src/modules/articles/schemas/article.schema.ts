import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ArticleStatus } from '../../../common/enums/article-status.enum.js';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';
import { User } from '../../users/schemas/user.schema.js';

@Schema({ _id: false })
export class ArticleAnalysis {
  @Prop({ type: String, required: true })
  practice!: string;

  @Prop({ type: String, required: true })
  claim!: string;

  @Prop({ type: String, enum: EvidenceOutcome })
  outcome!: EvidenceOutcome;

  @Prop({ type: String, enum: ResearchMethod })
  researchMethod?: ResearchMethod;

  @Prop({ type: String, enum: ParticipantType })
  participantType?: ParticipantType;

  @Prop({ type: String })
  summary?: string;
}

const ArticleAnalysisSchema = SchemaFactory.createForClass(ArticleAnalysis);

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: [String], default: [] })
  authors!: string[];

  @Prop({ type: String })
  journalOrConference?: string;

  @Prop({ type: Number })
  publicationYear?: number;

  @Prop({ type: String })
  volume?: string;

  @Prop({ type: String })
  issue?: string;

  @Prop({ type: String })
  pages?: string;

  @Prop({ type: String })
  doi?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  submitter!: Types.ObjectId;

  @Prop({ type: String, enum: ArticleStatus, default: ArticleStatus.Submitted })
  status!: ArticleStatus;

  @Prop({ type: String })
  moderationNote?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  moderatedBy?: Types.ObjectId;

  @Prop({ type: Date })
  moderatedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  analyst?: Types.ObjectId;

  @Prop({ type: Date })
  analysisCompletedAt?: Date;

  @Prop({ type: ArticleAnalysisSchema })
  analysis?: ArticleAnalysis;

  @Prop({ type: Number, default: 0 })
  ratingCount!: number;

  @Prop({ type: Number, default: 0 })
  ratingTotal!: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.set('toJSON', {
  versionKey: false
});



