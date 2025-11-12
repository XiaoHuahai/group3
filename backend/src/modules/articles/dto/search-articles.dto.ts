import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';

export class SearchArticlesDto {
  @IsOptional()
  @IsString()
  practice?: string;

  @IsOptional()
  @IsString()
  claim?: string;

  @IsOptional()
  @IsEnum(EvidenceOutcome)
  outcome?: EvidenceOutcome;

  @IsOptional()
  @IsEnum(ResearchMethod)
  researchMethod?: ResearchMethod;

  @IsOptional()
  @IsEnum(ParticipantType)
  participantType?: ParticipantType;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearFrom?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  yearTo?: number;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}



