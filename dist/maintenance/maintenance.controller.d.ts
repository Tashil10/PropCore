import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    create(propertyId: string, dto: CreateMaintenanceDto): Promise<import("./schemas/maintenance-request.schema").MaintenanceRequestDocument>;
    findAll(propertyId: string): Promise<import("./schemas/maintenance-request.schema").MaintenanceRequestDocument[]>;
}
