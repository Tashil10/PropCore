import { PropertiesService } from '../properties/properties.service';
import { LeasesService } from '../leases/leases.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
export declare class SeedService {
    private readonly propertiesService;
    private readonly leasesService;
    private readonly maintenanceService;
    constructor(propertiesService: PropertiesService, leasesService: LeasesService, maintenanceService: MaintenanceService);
    run(): Promise<{
        propertiesCreated: number;
        leasesCreated: number;
        maintenanceCreated: number;
    }>;
}
