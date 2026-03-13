import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { SearchPropertiesDto } from './dto/search-properties.dto';
export declare class PropertiesController {
    private readonly propertiesService;
    constructor(propertiesService: PropertiesService);
    create(dto: CreatePropertyDto): Promise<import("./schemas/property.schema").PropertyDocument>;
    search(dto: SearchPropertiesDto): Promise<import("./schemas/property.schema").PropertyDocument[]>;
    findAll(limit: number, skip: number): Promise<import("./schemas/property.schema").PropertyDocument[]>;
    findOne(id: string): Promise<import("./schemas/property.schema").PropertyDocument>;
    update(id: string, dto: UpdatePropertyDto): Promise<import("./schemas/property.schema").PropertyDocument>;
    remove(id: string): Promise<void>;
}
