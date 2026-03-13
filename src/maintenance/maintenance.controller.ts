import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@ApiTags('maintenance')
@Controller('properties/:propertyId/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @ApiOperation({
    summary: 'Submit maintenance request (AI triages urgency/category)',
  })
  @ApiResponse({ status: 201, description: 'Request created and triaged.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  create(
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateMaintenanceDto,
  ) {
    return this.maintenanceService.create(propertyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List maintenance requests for a property' })
  @ApiResponse({ status: 200, description: 'List of maintenance requests.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  findAll(@Param('propertyId') propertyId: string) {
    return this.maintenanceService.findAllByProperty(propertyId);
  }
}
