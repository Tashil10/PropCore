import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: '123 High Street, London' })
  @IsString()
  @MinLength(1)
  address: string;

  @ApiPropertyOptional({ example: ['parking', 'garden'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ example: 'Spacious two-bed flat with garden access.' })
  @IsOptional()
  @IsString()
  description?: string;
}
