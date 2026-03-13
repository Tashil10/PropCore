import { LeasesService } from './leases.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
export declare class LeasesController {
    private readonly leasesService;
    constructor(leasesService: LeasesService);
    create(propertyId: string, dto: CreateLeaseDto): Promise<import("./schemas/lease.schema").LeaseDocument>;
    findAll(propertyId: string): Promise<import("./schemas/lease.schema").LeaseDocument[]>;
    findOne(propertyId: string, leaseId: string): Promise<import("./schemas/lease.schema").LeaseDocument>;
}
