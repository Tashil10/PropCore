import { Module } from '@nestjs/common';
import { PropertiesModule } from '../properties/properties.module';
import { LeasesModule } from '../leases/leases.module';
import { MaintenanceModule } from '../maintenance/maintenance.module';
import { SeedService } from './seed.service';

@Module({
  imports: [PropertiesModule, LeasesModule, MaintenanceModule],
  providers: [SeedService],
})
export class SeedModule {}
