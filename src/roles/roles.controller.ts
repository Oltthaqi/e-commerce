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
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';

@ApiBearerAuth('access-token')
@Controller('roles')
@UseGuards(PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @SetPermissions(UserPermissions.ROLES)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }
  @Post('assign/permissions/:id')
  @SetPermissions(UserPermissions.ROLES)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionId: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  givePermissionToRole(
    @Param('id') id: number,
    @Body('permissionId') permissionId: number[],
  ) {
    return this.rolesService.givePermissionToRole(+id, permissionId);
  }

  @Post('remove/permission/:id')
  @SetPermissions(UserPermissions.ROLES)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        permissionId: {
          type: 'array',
          items: { type: 'number' },
        },
      },
    },
  })
  removePermissionFromRole(
    @Param('id') id: number,
    @Body('permissionId') permissionId: number[],
  ) {
    return this.rolesService.removePermission(+id, permissionId);
  }

  @Post('assign/Role/:userId/:roleId')
  @SetPermissions(UserPermissions.ROLES)
  assignRoleToUser(
    @Param('userId') userId: number,
    @Param('roleId') roleId: number,
  ) {
    return this.rolesService.roleAsign(userId, roleId);
  }

  @Get()
  @SetPermissions(UserPermissions.ROLES)
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.ROLES)
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.ROLES)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.ROLES)
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
