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
import { CarrierService } from './carrier.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('carrier')
@UseGuards(PermissionsGuard)
export class CarrierController {
  constructor(private readonly carrierService: CarrierService) {}

  @Post()
  @SetPermissions(UserPermissions.USERS_CREATE)
  create(@Body() createCarrierDto: CreateCarrierDto) {
    return this.carrierService.create(createCarrierDto);
  }

  @Get()
  @SetPermissions(UserPermissions.USERS_GET)
  findAll() {
    return this.carrierService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.USERS_GET)
  findOne(@Param('id') id: string) {
    return this.carrierService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.USERS_EDIT)
  update(@Param('id') id: string, @Body() updateCarrierDto: UpdateCarrierDto) {
    return this.carrierService.update(+id, updateCarrierDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.USERS_DELETE)
  remove(@Param('id') id: string) {
    return this.carrierService.remove(+id);
  }

  @Post('GiveOrder/:orderId/:carrierId')
  @SetPermissions(UserPermissions.USERS_CREATE)
  GiveOrder(
    @Param('orderId') orderId: string,
    @Param('carrierId') carrierId: string,
  ) {
    return this.carrierService.GivecarrierOrder(+orderId, +carrierId);
  }
}
