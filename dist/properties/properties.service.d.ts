import { Model } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyDocument } from './schemas/property.schema';
import { GeminiService } from '../common/gemini.service';
export declare class PropertiesService {
    private propertyModel;
    private readonly geminiService;
    constructor(propertyModel: Model<PropertyDocument>, geminiService: GeminiService);
    create(dto: CreatePropertyDto): Promise<PropertyDocument>;
    findAll(limit?: number, skip?: number): Promise<PropertyDocument[]>;
    findById(id: string): Promise<PropertyDocument>;
    update(id: string, dto: UpdatePropertyDto): Promise<PropertyDocument>;
    remove(id: string): Promise<void>;
    search(query: string, limit?: number): Promise<PropertyDocument[]>;
    private updateEmbedding;
}
