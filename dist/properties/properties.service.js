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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const property_schema_1 = require("./schemas/property.schema");
const gemini_service_1 = require("../common/gemini.service");
function cosineSimilarity(a, b) {
    if (a.length !== b.length || a.length === 0)
        return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
}
let PropertiesService = class PropertiesService {
    propertyModel;
    geminiService;
    constructor(propertyModel, geminiService) {
        this.propertyModel = propertyModel;
        this.geminiService = geminiService;
    }
    async create(dto) {
        const created = new this.propertyModel(dto);
        await created.save();
        if (created.description?.trim()) {
            await this.updateEmbedding(created);
        }
        return this.propertyModel
            .findById(created._id)
            .exec();
    }
    async findAll(limit = 50, skip = 0) {
        return this.propertyModel.find().limit(limit).skip(skip).exec();
    }
    async findById(id) {
        const property = await this.propertyModel.findById(id).exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with id ${id} not found`);
        }
        return property;
    }
    async update(id, dto) {
        const property = await this.propertyModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
        if (!property) {
            throw new common_1.NotFoundException(`Property with id ${id} not found`);
        }
        if (dto.description !== undefined && property.description?.trim()) {
            await this.updateEmbedding(property);
        }
        return this.propertyModel.findById(id).exec();
    }
    async remove(id) {
        const result = await this.propertyModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Property with id ${id} not found`);
        }
    }
    async search(query, limit = 20) {
        const queryEmbedding = await this.geminiService.embedText(query);
        const properties = await this.propertyModel
            .find({ embedding: { $exists: true, $ne: null } })
            .select('+embedding')
            .limit(limit * 2)
            .lean()
            .exec();
        const withScore = properties.map((p) => ({
            ...p,
            _score: cosineSimilarity(p.embedding ?? [], queryEmbedding),
        }));
        withScore.sort((a, b) => b._score - a._score);
        const top = withScore.slice(0, limit);
        const ids = top.map((p) => p._id);
        const ordered = await this.propertyModel.find({ _id: { $in: ids } }).exec();
        const orderMap = new Map(ids.map((id, i) => [String(id), i]));
        ordered.sort((a, b) => (orderMap.get(a._id.toString()) ?? 0) -
            (orderMap.get(b._id.toString()) ?? 0));
        return ordered;
    }
    async updateEmbedding(property) {
        try {
            const text = [
                property.address,
                property.description,
                (property.amenities ?? []).join(' '),
            ]
                .filter(Boolean)
                .join(' ');
            const embedding = await this.geminiService.embedText(text);
            await this.propertyModel
                .findByIdAndUpdate(property._id, { embedding })
                .exec();
        }
        catch {
        }
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(property_schema_1.Property.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        gemini_service_1.GeminiService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map