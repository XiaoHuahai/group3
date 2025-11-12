var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
export class CreateArticleDto {
    title;
    authors;
    journalOrConference;
    publicationYear;
    volume;
    issue;
    pages;
    doi;
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
__decorate([
    IsArray(),
    ArrayNotEmpty(),
    IsString({ each: true }),
    __metadata("design:type", Array)
], CreateArticleDto.prototype, "authors", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "journalOrConference", void 0);
__decorate([
    IsOptional(),
    IsInt(),
    Min(1900),
    Max(2100),
    __metadata("design:type", Number)
], CreateArticleDto.prototype, "publicationYear", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "volume", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "issue", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "pages", void 0);
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "doi", void 0);
//# sourceMappingURL=create-article.dto.js.map