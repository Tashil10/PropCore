import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ timestamps: true })
export class Property {
  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({ default: '' })
  description: string;

  @Prop({ type: [Number], default: null, select: false })
  embedding: number[] | null;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
