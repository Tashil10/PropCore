import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

/**
 * Create a lease by providing extracted terms (and optional metadata).
 * No PDF upload; use this JSON body for lease creation.
 */
export class CreateLeaseDto {
  @ApiProperty({
    description: 'Lease terms object (e.g. monthlyRent, deposit, startDate, endDate)',
    example: { monthlyRent: 1200, deposit: 2400, startDate: '2025-01-01', endDate: '2026-01-01' },
  })
  @IsObject()
  extractedTerms: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Lease status',
    enum: ['draft', 'confirmed'],
    default: 'draft',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Original document filename (if applicable)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  originalFileName?: string | null;
}
