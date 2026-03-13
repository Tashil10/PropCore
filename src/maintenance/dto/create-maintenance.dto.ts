import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateMaintenanceDto {
  @ApiProperty({
    example: 'Kitchen tap is dripping and there is mold under the sink.',
  })
  @IsString()
  @MinLength(1)
  description: string;
}
