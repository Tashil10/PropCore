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
exports.MaintenanceRequestSchema = exports.MaintenanceRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MaintenanceRequest = class MaintenanceRequest {
    propertyId;
    description;
    urgency;
    category;
    status;
    triagedAt;
};
exports.MaintenanceRequest = MaintenanceRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Property', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MaintenanceRequest.prototype, "propertyId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'medium', enum: ['low', 'medium', 'high'] }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "urgency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'general',
        enum: ['plumbing', 'electrical', 'appliances', 'structural', 'general'],
    }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        default: 'submitted',
        enum: ['submitted', 'triaged', 'assigned', 'resolved'],
    }),
    __metadata("design:type", String)
], MaintenanceRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], MaintenanceRequest.prototype, "triagedAt", void 0);
exports.MaintenanceRequest = MaintenanceRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MaintenanceRequest);
exports.MaintenanceRequestSchema = mongoose_1.SchemaFactory.createForClass(MaintenanceRequest);
//# sourceMappingURL=maintenance-request.schema.js.map