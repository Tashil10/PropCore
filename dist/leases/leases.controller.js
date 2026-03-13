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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeasesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const leases_service_1 = require("./leases.service");
const create_lease_dto_1 = require("./dto/create-lease.dto");
let LeasesController = class LeasesController {
    leasesService;
    constructor(leasesService) {
        this.leasesService = leasesService;
    }
    async create(propertyId, dto) {
        return this.leasesService.create(propertyId, dto);
    }
    findAll(propertyId) {
        return this.leasesService.findAllByProperty(propertyId);
    }
    findOne(propertyId, leaseId) {
        return this.leasesService.findOne(propertyId, leaseId);
    }
};
exports.LeasesController = LeasesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create lease (JSON body with extractedTerms)',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['extractedTerms'],
            properties: {
                extractedTerms: {
                    type: 'object',
                    description: 'Lease terms (e.g. monthlyRent, deposit, startDate, endDate)',
                },
                status: { type: 'string', enum: ['draft', 'confirmed'], default: 'draft' },
                originalFileName: { type: 'string', nullable: true },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Lease created.',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or missing extractedTerms.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found.' }),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_lease_dto_1.CreateLeaseDto]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List leases for a property' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of leases.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found.' }),
    __param(0, (0, common_1.Param)('propertyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':leaseId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lease by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lease with extracted terms.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Lease or property not found.' }),
    __param(0, (0, common_1.Param)('propertyId')),
    __param(1, (0, common_1.Param)('leaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], LeasesController.prototype, "findOne", null);
exports.LeasesController = LeasesController = __decorate([
    (0, swagger_1.ApiTags)('leases'),
    (0, common_1.Controller)('properties/:propertyId/leases'),
    __metadata("design:paramtypes", [leases_service_1.LeasesService])
], LeasesController);
//# sourceMappingURL=leases.controller.js.map