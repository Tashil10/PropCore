import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './maintenance.service';
import {
  MaintenanceRequest,
  MaintenanceRequestSchema,
} from './schemas/maintenance-request.schema';
import { MaintenanceEventsService } from './events/maintenance-events.service';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MaintenanceRequest.name,
        schema: MaintenanceRequestSchema,
      },
    ]),
    PropertiesModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceEventsService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
