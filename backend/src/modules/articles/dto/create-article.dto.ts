import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  title!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  authors!: string[];

  @IsOptional()
  @IsString()
  journalOrConference?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  publicationYear?: number;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  issue?: string;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsString()
  doi?: string;
}


