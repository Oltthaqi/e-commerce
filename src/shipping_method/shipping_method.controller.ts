import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShippingMethodService } from './shipping_method.service';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';

@Controller('shipping-method')
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Post()
  create(@Body() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createShippingMethodDto);
  }

  @Get()
  findAll() {
    return this.shippingMethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shippingMethodService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShippingMethodDto: UpdateShippingMethodDto) {
    return this.shippingMethodService.update(+id, updateShippingMethodDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shippingMethodService.remove(+id);
  }
}
