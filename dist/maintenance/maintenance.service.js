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
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const maintenance_request_schema_1 = require("./schemas/maintenance-request.schema");
const properties_service_1 = require("../properties/properties.service");
const gemini_service_1 = require("../common/gemini.service");
const maintenance_events_service_1 = require("./events/maintenance-events.service");
const TRIAGE_PROMPT = `Classify this maintenance description. Reply with ONLY a valid JSON object (no markdown) with two keys: "urgency" (one of: low, medium, high) and "category" (one of: plumbing, electrical, appliances, structural, general). Example: {"urgency":"high","category":"plumbing"}.`;
let MaintenanceService = class MaintenanceService {
    maintenanceModel;
    propertiesService;
    geminiService;
    eventsService;
    constructor(maintenanceModel, propertiesService, geminiService, eventsService) {
        this.maintenanceModel = maintenanceModel;
        this.propertiesService = propertiesService;
        this.geminiService = geminiService;
        this.eventsService = eventsService;
    }
    async create(propertyId, dto) {
        await this.propertiesService.findById(propertyId);
        const request = new this.maintenanceModel({
            propertyId: new mongoose_2.Types.ObjectId(propertyId),
            description: dto.description,
            status: 'submitted',
        });
        await request.save();
        let urgency = 'medium';
        let category = 'general';
        try {
            const triaged = await this.triage(dto.description);
            urgency = triaged.urgency;
            category = triaged.category;
        }
        catch {
        }
        request.urgency = urgency;
        request.category = category;
        request.status = 'triaged';
        request.triagedAt = new Date();
        await request.save();
        this.eventsService.emitTriaged(request);
        return request;
    }
    async findAllByProperty(propertyId) {
        await this.propertiesService.findById(propertyId);
        return this.maintenanceModel
            .find({ propertyId: new mongoose_2.Types.ObjectId(propertyId) })
            .exec();
    }
    async triage(description) {
        const raw = await this.geminiService.generateText(`${TRIAGE_PROMPT}\n\nDescription: ${description}`);
        const parsed = this.parseTriageResponse(raw);
        return {
            urgency: parsed.urgency ?? 'medium',
            category: parsed.category ?? 'general',
        };
    }
    parseTriageResponse(raw) {
        const trimmed = raw.trim();
        const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
        if (!jsonMatch)
            return {};
        try {
            const obj = JSON.parse(jsonMatch[0]);
            return {
                urgency: ['low', 'medium', 'high'].includes(obj.urgency)
                    ? obj.urgency
                    : undefined,
                category: [
                    'plumbing',
                    'electrical',
                    'appliances',
                    'structural',
                    'general',
                ].includes(obj.category)
                    ? obj.category
                    : undefined,
            };
        }
        catch {
            return {};
        }
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(maintenance_request_schema_1.MaintenanceRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        properties_service_1.PropertiesService,
        gemini_service_1.GeminiService,
        maintenance_events_service_1.MaintenanceEventsService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map