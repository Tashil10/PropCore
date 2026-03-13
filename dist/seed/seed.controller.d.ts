import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seed(): Promise<{
        propertiesCreated: number;
        leasesCreated: number;
        maintenanceCreated: number;
    }>;
}
