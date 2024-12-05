import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';

@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(PermissionsGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @SetPermissions(UserPermissions.ORDERS)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @SetPermissions(UserPermissions.ORDERS)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.ORDERS)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.ORDERS)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.ORDERS)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
