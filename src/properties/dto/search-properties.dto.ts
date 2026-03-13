import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SearchPropertiesDto {
  @ApiProperty({
    example: 'pet-friendly with garden and parking',
    description: 'Natural language search query',
  })
  @IsString()
  @MinLength(1)
  query: string;
}
