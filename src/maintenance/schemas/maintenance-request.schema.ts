import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MaintenanceRequestDocument = MaintenanceRequest & Document;

@Schema({ timestamps: true })
export class MaintenanceRequest {
  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  propertyId: Types.ObjectId;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'medium', enum: ['low', 'medium', 'high'] })
  urgency: string;

  @Prop({
    default: 'general',
    enum: ['plumbing', 'electrical', 'appliances', 'structural', 'general'],
  })
  category: string;

  @Prop({
    default: 'submitted',
    enum: ['submitted', 'triaged', 'assigned', 'resolved'],
  })
  status: string;

  @Prop({ type: Date, default: null })
  triagedAt: Date | null;
}

export const MaintenanceRequestSchema =
  SchemaFactory.createForClass(MaintenanceRequest);
