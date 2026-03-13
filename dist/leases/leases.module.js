"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeasesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const leases_controller_1 = require("./leases.controller");
const leases_service_1 = require("./leases.service");
const lease_schema_1 = require("./schemas/lease.schema");
const properties_module_1 = require("../properties/properties.module");
let LeasesModule = class LeasesModule {
};
exports.LeasesModule = LeasesModule;
exports.LeasesModule = LeasesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: lease_schema_1.Lease.name, schema: lease_schema_1.LeaseSchema }]),
            properties_module_1.PropertiesModule,
        ],
        controllers: [leases_controller_1.LeasesController],
        providers: [leases_service_1.LeasesService],
        exports: [leases_service_1.LeasesService],
    })
], LeasesModule);
//# sourceMappingURL=leases.module.js.map