import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../enum/Order.status.enum';

export class UpdateOrderDto {
  updatedAt: Date;

  @ApiProperty()
  status: OrderStatus;
}
