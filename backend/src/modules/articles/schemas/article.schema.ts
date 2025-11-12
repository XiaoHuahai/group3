import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { ArticleStatus } from '../../../common/enums/article-status.enum.js';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';
import { User } from '../../users/schemas/user.schema.js';

@Schema({ _id: false })
export class ArticleAnalysis {
  @Prop({ required: true })
  practice!: string;

  @Prop({ required: true })
  claim!: string;

  @Prop({ enum: EvidenceOutcome })
  outcome!: EvidenceOutcome;

  @Prop({ enum: ResearchMethod })
  researchMethod?: ResearchMethod;

  @Prop({ enum: ParticipantType })
  participantType?: ParticipantType;

  @Prop()
  summary?: string;
}

const ArticleAnalysisSchema = SchemaFactory.createForClass(ArticleAnalysis);

@Schema({ timestamps: true })
export class Article extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ type: [String], default: [] })
  authors!: string[];

  @Prop()
  journalOrConference?: string;

  @Prop()
  publicationYear?: number;

  @Prop()
  volume?: string;

  @Prop()
  issue?: string;

  @Prop()
  pages?: string;

  @Prop()
  doi?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: true })
  submitter!: Types.ObjectId;

  @Prop({ enum: ArticleStatus, default: ArticleStatus.Submitted })
  status!: ArticleStatus;

  @Prop()
  moderationNote?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  moderatedBy?: Types.ObjectId;

  @Prop()
  moderatedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  analyst?: Types.ObjectId;

  @Prop()
  analysisCompletedAt?: Date;

  @Prop({ type: ArticleAnalysisSchema })
  analysis?: ArticleAnalysis;

  @Prop({ default: 0 })
  ratingCount!: number;

  @Prop({ default: 0 })
  ratingTotal!: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
ArticleSchema.set('toJSON', {
  versionKey: false
});



