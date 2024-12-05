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
import { OrderLinesService } from './order-lines.service';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { SetPermissions } from 'src/auth/Decorators/metaData';

@ApiBearerAuth('access-token')
@Controller('order-lines')
@UseGuards(PermissionsGuard)
export class OrderLinesController {
  constructor(private readonly orderLinesService: OrderLinesService) {}

  @Post()
  @SetPermissions(UserPermissions.ORDERS)
  create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return this.orderLinesService.create(createOrderLineDto);
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

  @Patch(':id')
  @SetPermissions(UserPermissions.ORDERS)
  update(
    @Param('id') id: string,
    @Body() updateOrderLineDto: UpdateOrderLineDto,
  ) {
    return this.orderLinesService.update(+id, updateOrderLineDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.ORDERS)
  remove(@Param('id') id: string) {
    return this.orderLinesService.remove(+id);
  }
}
