var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EvidenceOutcome } from '../../../common/enums/evidence-outcome.enum.js';
import { ResearchMethod } from '../../../common/enums/research-method.enum.js';
import { ParticipantType } from '../../../common/enums/participant-type.enum.js';
export class SearchArticlesDto {
    practice;
    claim;
    outcome;
    researchMethod;
    participantType;
    yearFrom;
    yearTo;
    searchTerm;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "practice", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "claim", void 0);
__decorate([
    IsOptional(),
    IsEnum(EvidenceOutcome),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "outcome", void 0);
__decorate([
    IsOptional(),
    IsEnum(ResearchMethod),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "researchMethod", void 0);
__decorate([
    IsOptional(),
    IsEnum(ParticipantType),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "participantType", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1900),
    Max(2100),
    __metadata("design:type", Number)
], SearchArticlesDto.prototype, "yearFrom", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1900),
    Max(2100),
    __metadata("design:type", Number)
], SearchArticlesDto.prototype, "yearTo", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], SearchArticlesDto.prototype, "searchTerm", void 0);
//# sourceMappingURL=search-articles.dto.js.map