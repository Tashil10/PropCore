import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MaintenanceRequest,
  MaintenanceRequestDocument,
} from './schemas/maintenance-request.schema';
import { PropertiesService } from '../properties/properties.service';
import { GeminiService } from '../common/gemini.service';
import { MaintenanceEventsService } from './events/maintenance-events.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

const TRIAGE_PROMPT = `Classify this maintenance description. Reply with ONLY a valid JSON object (no markdown) with two keys: "urgency" (one of: low, medium, high) and "category" (one of: plumbing, electrical, appliances, structural, general). Example: {"urgency":"high","category":"plumbing"}.`;

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectModel(MaintenanceRequest.name)
    private maintenanceModel: Model<MaintenanceRequestDocument>,
    private readonly propertiesService: PropertiesService,
    private readonly geminiService: GeminiService,
    private readonly eventsService: MaintenanceEventsService,
  ) {}

  async create(
    propertyId: string,
    dto: CreateMaintenanceDto,
  ): Promise<MaintenanceRequestDocument> {
    await this.propertiesService.findById(propertyId);

    const request = new this.maintenanceModel({
      propertyId: new Types.ObjectId(propertyId),
      description: dto.description,
      status: 'submitted',
    });
    await request.save();

    let urgency = 'medium';
    let category = 'general';
    try {
      const triaged = await this.triage(dto.description);
      urgency = triaged.urgency;
      category = triaged.category;
    } catch {
      // Gemini triage failed: keep defaults so the request is still saved and usable
    }
    request.urgency = urgency;
    request.category = category;
    request.status = 'triaged';
    request.triagedAt = new Date();
    await request.save();

    this.eventsService.emitTriaged(request);
    return request;
  }

  async findAllByProperty(
    propertyId: string,
  ): Promise<MaintenanceRequestDocument[]> {
    await this.propertiesService.findById(propertyId);
    return this.maintenanceModel
      .find({ propertyId: new Types.ObjectId(propertyId) })
      .exec();
  }

  private async triage(
    description: string,
  ): Promise<{ urgency: string; category: string }> {
    const raw = await this.geminiService.generateText(
      `${TRIAGE_PROMPT}\n\nDescription: ${description}`,
    );
    const parsed = this.parseTriageResponse(raw);
    return {
      urgency: parsed.urgency ?? 'medium',
      category: parsed.category ?? 'general',
    };
  }

  private parseTriageResponse(raw: string): {
    urgency?: string;
    category?: string;
  } {
    const trimmed = raw.trim();
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    try {
      const obj = JSON.parse(jsonMatch[0]) as Record<string, string>;
      return {
        urgency: ['low', 'medium', 'high'].includes(obj.urgency)
          ? obj.urgency
          : undefined,
        category: [
          'plumbing',
          'electrical',
          'appliances',
          'structural',
          'general',
        ].includes(obj.category)
          ? obj.category
          : undefined,
      };
    } catch {
      return {};
    }
  }
}
