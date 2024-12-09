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
import { ShippingMethodService } from './shipping_method.service';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { SetPermissions } from 'src/auth/Decorators/metaData';
@ApiBearerAuth('access-token')
@Controller('shipping-method')
@UseGuards(PermissionsGuard)
export class ShippingMethodController {
  constructor(private readonly shippingMethodService: ShippingMethodService) {}

  @Post()
  @SetPermissions(UserPermissions.SHIPPING_CREATE)
  create(@Body() createShippingMethodDto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(createShippingMethodDto);
  }

  @Get()
  @SetPermissions(UserPermissions.SHIPPING_GET)
  findAll() {
    return this.shippingMethodService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.SHIPPING_GET)
  findOne(@Param('id') id: string) {
    return this.shippingMethodService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.SHIPPING_EDIT)
  update(
    @Param('id') id: string,
    @Body() updateShippingMethodDto: UpdateShippingMethodDto,
  ) {
    return this.shippingMethodService.update(+id, updateShippingMethodDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.SHIPPING_DELETE)
  remove(@Param('id') id: string) {
    return this.shippingMethodService.remove(+id);
  }
}
