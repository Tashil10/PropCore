"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLeaseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateLeaseDto {
    extractedTerms;
    status;
    originalFileName;
}
exports.CreateLeaseDto = CreateLeaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lease terms object (e.g. monthlyRent, deposit, startDate, endDate)',
        example: { monthlyRent: 1200, deposit: 2400, startDate: '2025-01-01', endDate: '2026-01-01' },
    }),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateLeaseDto.prototype, "extractedTerms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Lease status',
        enum: ['draft', 'confirmed'],
        default: 'draft',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLeaseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Original document filename (if applicable)',
        nullable: true,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], CreateLeaseDto.prototype, "originalFileName", void 0);
//# sourceMappingURL=create-lease.dto.js.map