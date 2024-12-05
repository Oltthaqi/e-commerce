import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  postalCode: string;
}
