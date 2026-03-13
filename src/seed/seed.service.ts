import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PropertiesService } from '../properties/properties.service';
import { LeasesService } from '../leases/leases.service';
import { MaintenanceService } from '../maintenance/maintenance.service';
import {
  DEMO_PROPERTIES,
  getLeaseForProperty,
  getMaintenanceForProperty,
} from './seed-data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly leasesService: LeasesService,
    private readonly maintenanceService: MaintenanceService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const n = await this.propertiesService.count();
    if (n === 0) {
      await this.run();
    }
  }

  async run(): Promise<{
    propertiesCreated: number;
    leasesCreated: number;
    maintenanceCreated: number;
  }> {
    let leasesCreated = 0;
    let maintenanceCreated = 0;

    for (let i = 0; i < DEMO_PROPERTIES.length; i++) {
      const p = DEMO_PROPERTIES[i];
      const property = await this.propertiesService.create(p);
      const id = property._id.toString();

      await this.leasesService.create(id, getLeaseForProperty(i));
      leasesCreated++;

      await this.maintenanceService.create(id, {
        description: getMaintenanceForProperty(i),
      });
      maintenanceCreated++;
    }

    return {
      propertiesCreated: DEMO_PROPERTIES.length,
      leasesCreated,
      maintenanceCreated,
    };
  }
}
