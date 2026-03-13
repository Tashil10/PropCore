import { Model } from 'mongoose';
import { LeaseDocument } from './schemas/lease.schema';
import { PropertiesService } from '../properties/properties.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
export declare class LeasesService {
    private leaseModel;
    private readonly propertiesService;
    constructor(leaseModel: Model<LeaseDocument>, propertiesService: PropertiesService);
    create(propertyId: string, dto: CreateLeaseDto): Promise<LeaseDocument>;
    findAllByProperty(propertyId: string): Promise<LeaseDocument[]>;
    findOne(propertyId: string, leaseId: string): Promise<LeaseDocument>;
}
