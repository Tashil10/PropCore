import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './schemas/property.schema';
import { GeminiService } from '../common/gemini.service';

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    private readonly geminiService: GeminiService,
  ) {}

  async create(dto: CreatePropertyDto): Promise<PropertyDocument> {
    const created = new this.propertyModel(dto);
    await created.save();
    if (created.description?.trim()) {
      await this.updateEmbedding(created);
    }
    return this.propertyModel
      .findById(created._id)
      .exec() as Promise<PropertyDocument>;
  }

  async findAll(limit = 50, skip = 0): Promise<PropertyDocument[]> {
    return this.propertyModel.find().limit(limit).skip(skip).exec();
  }

  async count(): Promise<number> {
    return this.propertyModel.countDocuments().exec();
  }

  async findById(id: string): Promise<PropertyDocument> {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
    return property;
  }

  async update(id: string, dto: UpdatePropertyDto): Promise<PropertyDocument> {
    const property = await this.propertyModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!property) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
    if (dto.description !== undefined && property.description?.trim()) {
      await this.updateEmbedding(property);
    }
    return this.propertyModel.findById(id).exec() as Promise<PropertyDocument>;
  }

  async remove(id: string): Promise<void> {
    const result = await this.propertyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Property with id ${id} not found`);
    }
  }

  async search(query: string, limit = 20): Promise<PropertyDocument[]> {
    const queryEmbedding = await this.geminiService.embedText(query);
    const properties = await this.propertyModel
      .find({ embedding: { $exists: true, $ne: null } })
      .select('+embedding')
      .limit(limit * 2)
      .lean()
      .exec();
    type WithEmbedding = { _id: unknown; embedding?: number[] };
    const withScore = (properties as WithEmbedding[]).map((p) => ({
      ...p,
      _score: cosineSimilarity(p.embedding ?? [], queryEmbedding),
    }));
    withScore.sort((a, b) => b._score - a._score);
    const top = withScore.slice(0, limit);
    const ids = top.map((p) => p._id);
    const ordered = await this.propertyModel.find({ _id: { $in: ids } }).exec();
    const orderMap = new Map(
      ids.map((id: unknown, i: number) => [String(id), i]),
    );
    ordered.sort(
      (a, b) =>
        (orderMap.get(a._id.toString()) ?? 0) -
        (orderMap.get(b._id.toString()) ?? 0),
    );
    return ordered;
  }

  private async updateEmbedding(property: PropertyDocument): Promise<void> {
    try {
      const text = [
        property.address,
        property.description,
        (property.amenities ?? []).join(' '),
      ]
        .filter(Boolean)
        .join(' ');
      const embedding = await this.geminiService.embedText(text);
      await this.propertyModel
        .findByIdAndUpdate(property._id, { embedding })
        .exec();
    } catch {
      // Embedding is optional: property is still created/updated without it.
      // Semantic search will simply not include this property until embedding is available.
    }
  }
}
