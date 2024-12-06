import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderLinesService } from './order-lines.service';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { Request } from 'express';

@ApiBearerAuth('access-token')
@Controller('order-lines')
@UseGuards(PermissionsGuard)
export class OrderLinesController {
  constructor(private readonly orderLinesService: OrderLinesService) {}

  @Post(':orderId/:productId')
  @SetPermissions(UserPermissions.ORDERS, UserPermissions.DEFAULT)
  create(
    @Param('orderId') orderId: number,
    @Param('productId') productId: number,
  ) {
    return this.orderLinesService.create(orderId, productId);
  }

  @Get()
  @SetPermissions(UserPermissions.ORDERS)
  findAll() {
    return this.orderLinesService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.ORDERS)
  findOne(@Param('id') id: string) {
    return this.orderLinesService.findOne(+id);
  }
  @Get('order/:orderId')
  @SetPermissions(UserPermissions.ORDERS, UserPermissions.DEFAULT)
  findByOrderId(@Param('orderId') orderId: string, @Req() req: Request) {
    const user = req.user;
    return this.orderLinesService.findByOrderId(+orderId, +user.userId);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.ORDERS)
  remove(@Param('id') id: string) {
    return this.orderLinesService.remove(+id);
  }
}
