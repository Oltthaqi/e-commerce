import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Request } from 'express';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';

@UseGuards(PermissionsGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @SetPermissions(UserPermissions.SHIPPING_CREATE)
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    const user = req.user;
    return this.addressesService.create(createAddressDto, user.userId);
  }

  @Get()
  @SetPermissions(UserPermissions.SHIPPING_GET)
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.SHIPPING_GET)
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.SHIPPING_EDIT)
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.addressesService.update(+id, updateAddressDto, user.userId);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.SHIPPING_DELETE)
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @Get('user')
  @SetPermissions(UserPermissions.SHIPPING_GET_OWN)
  findUserAddresses(@Req() req: Request) {
    const user = req.user;
    return this.addressesService.findUserAddresses(user.userId);
  }

  @Get('user/:addressId')
  @SetPermissions(UserPermissions.SHIPPING_GET)
  findUserAddress(@Param('addressId') addressId: string, @Req() req: Request) {
    const user = req.user;
    return this.addressesService.findUserAddress(user.userId, +addressId);
  }

  @Delete('user/:addressId')
  @SetPermissions(UserPermissions.SHIPPING_DELETE)
  removeUserAddress(
    @Param('addressId') addressId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.addressesService.removeUserAddress(user.userId, +addressId);
  }
}
