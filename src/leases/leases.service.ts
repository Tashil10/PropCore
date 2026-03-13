import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lease, LeaseDocument } from './schemas/lease.schema';
import { PropertiesService } from '../properties/properties.service';
import { CreateLeaseDto } from './dto/create-lease.dto';

@Injectable()
export class LeasesService {
  constructor(
    @InjectModel(Lease.name) private leaseModel: Model<LeaseDocument>,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(
    propertyId: string,
    dto: CreateLeaseDto,
  ): Promise<LeaseDocument> {
    await this.propertiesService.findById(propertyId);

    const lease = new this.leaseModel({
      propertyId: new Types.ObjectId(propertyId),
      extractedTerms: dto.extractedTerms ?? {},
      status: dto.status ?? 'draft',
      originalFileName: dto.originalFileName ?? null,
    });
    return lease.save();
  }

  async findAllByProperty(propertyId: string): Promise<LeaseDocument[]> {
    await this.propertiesService.findById(propertyId);
    return this.leaseModel
      .find({ propertyId: new Types.ObjectId(propertyId) })
      .exec();
  }

  async findOne(propertyId: string, leaseId: string): Promise<LeaseDocument> {
    await this.propertiesService.findById(propertyId);
    const lease = await this.leaseModel
      .findOne({
        _id: leaseId,
        propertyId: new Types.ObjectId(propertyId),
      })
      .exec();
    if (!lease) {
      throw new NotFoundException(
        `Lease with id ${leaseId} not found for this property`,
      );
    }
    return lease;
  }
}
