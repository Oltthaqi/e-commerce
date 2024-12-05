import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { ProductStatus } from '../enum/products.status.enum';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  status: ProductStatus.ACTIVE;

  @ApiProperty()
  @IsNumber()
  stock: number;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}
