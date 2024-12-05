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
  @SetPermissions(UserPermissions.DEFAULT, UserPermissions.SHIPPING)
  create(@Body() createAddressDto: CreateAddressDto, @Req() req: Request) {
    const user = req.user;
    return this.addressesService.create(createAddressDto, user.userId);
  }

  @Get()
  @SetPermissions(UserPermissions.SHIPPING)
  findAll() {
    return this.addressesService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.SHIPPING)
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.DEFAULT, UserPermissions.SHIPPING)
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.addressesService.update(+id, updateAddressDto, user.userId);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.SHIPPING)
  remove(@Param('id') id: string) {
    return this.addressesService.remove(+id);
  }

  @Get('user')
  @SetPermissions(UserPermissions.DEFAULT, UserPermissions.SHIPPING)
  findUserAddresses(@Req() req: Request) {
    const user = req.user;
    return this.addressesService.findUserAddresses(user.userId);
  }

  @Get('user/:addressId')
  @SetPermissions(UserPermissions.DEFAULT, UserPermissions.SHIPPING)
  findUserAddress(@Param('addressId') addressId: string, @Req() req: Request) {
    const user = req.user;
    return this.addressesService.findUserAddress(user.userId, +addressId);
  }

  @Delete('user/:addressId')
  @SetPermissions(UserPermissions.DEFAULT, UserPermissions.SHIPPING)
  removeUserAddress(
    @Param('addressId') addressId: string,
    @Req() req: Request,
  ) {
    const user = req.user;
    return this.addressesService.removeUserAddress(user.userId, +addressId);
  }
}
