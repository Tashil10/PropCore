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
exports.PropertiesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pipes_1 = require("@nestjs/common/pipes");
const properties_service_1 = require("./properties.service");
const create_property_dto_1 = require("./dto/create-property.dto");
const update_property_dto_1 = require("./dto/update-property.dto");
const search_properties_dto_1 = require("./dto/search-properties.dto");
let PropertiesController = class PropertiesController {
    propertiesService;
    constructor(propertiesService) {
        this.propertiesService = propertiesService;
    }
    create(dto) {
        return this.propertiesService.create(dto);
    }
    search(dto) {
        return this.propertiesService.search(dto.query);
    }
    findAll(limit, skip) {
        return this.propertiesService.findAll(limit, skip);
    }
    findOne(id) {
        return this.propertiesService.findById(id);
    }
    update(id, dto) {
        return this.propertiesService.update(id, dto);
    }
    remove(id) {
        return this.propertiesService.remove(id);
    }
};
exports.PropertiesController = PropertiesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a property' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Property created.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_property_dto_1.CreatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Semantic search by natural language query' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Properties ranked by relevance.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_properties_dto_1.SearchPropertiesDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List properties' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of properties.' }),
    __param(0, (0, common_1.Query)('limit', new pipes_1.DefaultValuePipe(50), pipes_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('skip', new pipes_1.DefaultValuePipe(0), pipes_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get property by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update property' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property updated.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_property_dto_1.UpdatePropertyDto]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete property' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Property deleted.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Property not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PropertiesController.prototype, "remove", null);
exports.PropertiesController = PropertiesController = __decorate([
    (0, swagger_1.ApiTags)('properties'),
    (0, common_1.Controller)('properties'),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService])
], PropertiesController);
//# sourceMappingURL=properties.controller.js.map