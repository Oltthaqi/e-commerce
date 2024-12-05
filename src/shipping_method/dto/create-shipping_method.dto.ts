import { ApiProperty } from '@nestjs/swagger';
import { IsDecimal, IsString } from 'class-validator';

export class CreateShippingMethodDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsDecimal()
  flat_rate: number;
}
