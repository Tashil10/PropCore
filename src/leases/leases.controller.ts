import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { CreateLeaseDto } from './dto/create-lease.dto';

@ApiTags('leases')
@Controller('properties/:propertyId/leases')
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create lease (JSON body with extractedTerms)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['extractedTerms'],
      properties: {
        extractedTerms: {
          type: 'object',
          description: 'Lease terms (e.g. monthlyRent, deposit, startDate, endDate)',
        },
        status: { type: 'string', enum: ['draft', 'confirmed'], default: 'draft' },
        originalFileName: { type: 'string', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Lease created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid or missing extractedTerms.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  async create(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateLeaseDto,
  ) {
    return this.leasesService.create(propertyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List leases for a property' })
  @ApiResponse({ status: 200, description: 'List of leases.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  findAll(@Param('propertyId') propertyId: string) {
    return this.leasesService.findAllByProperty(propertyId);
  }

  @Get(':leaseId')
  @ApiOperation({ summary: 'Get lease by ID' })
  @ApiResponse({ status: 200, description: 'Lease with extracted terms.' })
  @ApiResponse({ status: 404, description: 'Lease or property not found.' })
  findOne(
    @Param('propertyId') propertyId: string,
    @Param('leaseId') leaseId: string,
  ) {
    return this.leasesService.findOne(propertyId, leaseId);
  }
}
