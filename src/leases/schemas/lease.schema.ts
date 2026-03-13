import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeaseDocument = Lease & Document;

@Schema({ timestamps: true })
export class Lease {
  @Prop({ type: Types.ObjectId, ref: 'Property', required: true })
  propertyId: Types.ObjectId;

  @Prop({ type: Object, default: {} })
  extractedTerms: Record<string, unknown>;

  @Prop({ default: 'draft', enum: ['draft', 'confirmed'] })
  status: string;

  @Prop({ type: String, default: null })
  originalFileName: string | null;
}

export const LeaseSchema = SchemaFactory.createForClass(Lease);
