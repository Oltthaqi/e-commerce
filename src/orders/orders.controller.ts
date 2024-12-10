import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { Request } from 'express';

@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post(':shippingMethodId')
  @SetPermissions(UserPermissions.ORDERS_CREATE)
  create(
    @Req() req: Request,
    @Param('shippingMethodId') shippingMethodId: number,
  ) {
    const user = req.user;
    return this.ordersService.create(user.userId, shippingMethodId);
  }

  @Get()
  @SetPermissions(UserPermissions.ORDERS_GET)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.ORDERS_GET)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.ORDERS_EDIT)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.ORDERS_DELETE)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  @Get('user/Orders')
  @SetPermissions(UserPermissions.ORDERS_GET_OWN)
  findUserOrders(@Req() req: Request) {
    const user = req.user;
    return this.ordersService.getOwnOrders(+user.userId);
  }

  @Get('Orders/:orderId')
  @SetPermissions(UserPermissions.ORDERS_GET_OWN)
  findUserOrder(@Req() req: Request, @Param('orderId') orderId: string) {
    const user = req.user;
    return this.ordersService.getOwnOrder(+user.userId, +orderId);
  }

  @Post(':orderId/split')
  @ApiProperty({
    description: 'Split an order into two orders',
    type: Array,
    items: {
      type: 'number',
    },
  })
  @SetPermissions(UserPermissions.ORDERS_REFUND)
  splitOrder(
    @Param('orderId') orderId: string,
    @Body() orderLineIds: number[],
  ) {
    return this.ordersService.splitOrder(+orderId, orderLineIds);
  }
}
