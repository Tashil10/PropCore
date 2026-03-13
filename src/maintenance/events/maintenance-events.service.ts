import { Injectable } from '@nestjs/common';
import { MaintenanceRequestDocument } from '../schemas/maintenance-request.schema';

@Injectable()
export class MaintenanceEventsService {
  /**
   * Called when a maintenance request has been triaged.
   * For now logs that a contractor would be notified; replace with
   * Bull/RabbitMQ when needed.
   */
  emitTriaged(request: MaintenanceRequestDocument): void {
    console.log(
      `[MaintenanceEvents] Would notify contractor for request ${String(request._id)} (${request.urgency}, ${request.category})`,
    );
  }
}
