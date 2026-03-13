import { Model } from 'mongoose';
import { MaintenanceRequestDocument } from './schemas/maintenance-request.schema';
import { PropertiesService } from '../properties/properties.service';
import { GeminiService } from '../common/gemini.service';
import { MaintenanceEventsService } from './events/maintenance-events.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
export declare class MaintenanceService {
    private maintenanceModel;
    private readonly propertiesService;
    private readonly geminiService;
    private readonly eventsService;
    constructor(maintenanceModel: Model<MaintenanceRequestDocument>, propertiesService: PropertiesService, geminiService: GeminiService, eventsService: MaintenanceEventsService);
    create(propertyId: string, dto: CreateMaintenanceDto): Promise<MaintenanceRequestDocument>;
    findAllByProperty(propertyId: string): Promise<MaintenanceRequestDocument[]>;
    private triage;
    private parseTriageResponse;
}
