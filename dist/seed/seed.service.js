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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const properties_service_1 = require("../properties/properties.service");
const leases_service_1 = require("../leases/leases.service");
const maintenance_service_1 = require("../maintenance/maintenance.service");
const DEMO_PROPERTIES = [
    {
        address: '42 Riverside Drive, London E1',
        description: 'Two-bedroom flat with river view, modern kitchen and balcony. Quiet building with lift.',
        amenities: ['parking', 'balcony', 'river view', 'lift'],
    },
    {
        address: '15 Oak Lane, Manchester M2',
        description: 'Spacious three-bed house with private garden and off-street parking. Ideal for families.',
        amenities: ['garden', 'parking', 'driveway'],
    },
    {
        address: '7 Marina Quay, Bristol BS1',
        description: 'One-bed apartment by the harbour. Marina view, gym and bike storage in building.',
        amenities: ['gym', 'bike storage', 'harbour view'],
    },
    {
        address: '88 High Street, Edinburgh EH1',
        description: 'Studio with garden access and on-site laundry. Walking distance to shops and transport.',
        amenities: ['garden', 'laundry', 'central'],
    },
];
const DEMO_LEASES = [
    {
        extractedTerms: {
            monthlyRent: 1450,
            deposit: 2900,
            startDate: '2025-01-15',
            endDate: '2026-01-14',
            tenantName: 'Jane Smith',
        },
        status: 'confirmed',
    },
    {
        extractedTerms: {
            monthlyRent: 1200,
            deposit: 2400,
            startDate: '2024-09-01',
            endDate: '2025-08-31',
        },
        status: 'draft',
    },
];
const DEMO_MAINTENANCE = [
    'Kitchen tap is dripping and there is mould under the sink.',
    'Heating not working in the living room.',
    'Broken window latch in bedroom – security concern.',
    'Light fitting in hallway flickers.',
];
let SeedService = class SeedService {
    propertiesService;
    leasesService;
    maintenanceService;
    constructor(propertiesService, leasesService, maintenanceService) {
        this.propertiesService = propertiesService;
        this.leasesService = leasesService;
        this.maintenanceService = maintenanceService;
    }
    async run() {
        let leasesCreated = 0;
        let maintenanceCreated = 0;
        for (const p of DEMO_PROPERTIES) {
            const property = await this.propertiesService.create(p);
            const id = property._id.toString();
            for (const lease of DEMO_LEASES) {
                await this.leasesService.create(id, lease);
                leasesCreated++;
            }
            for (const desc of DEMO_MAINTENANCE) {
                await this.maintenanceService.create(id, { description: desc });
                maintenanceCreated++;
            }
        }
        return {
            propertiesCreated: DEMO_PROPERTIES.length,
            leasesCreated,
            maintenanceCreated,
        };
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [properties_service_1.PropertiesService,
        leases_service_1.LeasesService,
        maintenance_service_1.MaintenanceService])
], SeedService);
//# sourceMappingURL=seed.service.js.map