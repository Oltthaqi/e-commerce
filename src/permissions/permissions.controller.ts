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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserPermissions } from './enum/User-Permissions.enum';
import { SetPermissions } from 'src/auth/Decorators/metaData';

@ApiBearerAuth('access-token')
@Controller('permissions')
@UseGuards(PermissionsGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @SetPermissions(UserPermissions.PERMISSION_CREATE)
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @SetPermissions(UserPermissions.PERMISSION_GET)
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.PERMISSION_GET)
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.PERMISSION_EDIT)
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.PERMISSION_DELETE)
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
