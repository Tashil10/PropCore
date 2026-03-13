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
exports.LeasesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lease_schema_1 = require("./schemas/lease.schema");
const properties_service_1 = require("../properties/properties.service");
let LeasesService = class LeasesService {
    leaseModel;
    propertiesService;
    constructor(leaseModel, propertiesService) {
        this.leaseModel = leaseModel;
        this.propertiesService = propertiesService;
    }
    async create(propertyId, dto) {
        await this.propertiesService.findById(propertyId);
        const lease = new this.leaseModel({
            propertyId: new mongoose_2.Types.ObjectId(propertyId),
            extractedTerms: dto.extractedTerms ?? {},
            status: dto.status ?? 'draft',
            originalFileName: dto.originalFileName ?? null,
        });
        return lease.save();
    }
    async findAllByProperty(propertyId) {
        await this.propertiesService.findById(propertyId);
        return this.leaseModel
            .find({ propertyId: new mongoose_2.Types.ObjectId(propertyId) })
            .exec();
    }
    async findOne(propertyId, leaseId) {
        await this.propertiesService.findById(propertyId);
        const lease = await this.leaseModel
            .findOne({
            _id: leaseId,
            propertyId: new mongoose_2.Types.ObjectId(propertyId),
        })
            .exec();
        if (!lease) {
            throw new common_1.NotFoundException(`Lease with id ${leaseId} not found for this property`);
        }
        return lease;
    }
};
exports.LeasesService = LeasesService;
exports.LeasesService = LeasesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lease_schema_1.Lease.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        properties_service_1.PropertiesService])
], LeasesService);
//# sourceMappingURL=leases.service.js.map