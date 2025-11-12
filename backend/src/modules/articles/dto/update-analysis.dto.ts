import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';

export class UpdateAnalysisDto {
  @IsString()
  practice!: string;

  @IsString()
  claim!: string;

  @IsEnum(EvidenceOutcome)
  outcome!: EvidenceOutcome;

  @IsOptional()
  @IsEnum(ResearchMethod)
  researchMethod?: ResearchMethod;

  @IsOptional()
  @IsEnum(ParticipantType)
  participantType?: ParticipantType;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  summary?: string;
}



