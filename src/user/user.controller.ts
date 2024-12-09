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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
@ApiBearerAuth('access-token')
@Controller('user')
@UseGuards(PermissionsGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @SetPermissions(UserPermissions.USERS_CREATE)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @SetPermissions(UserPermissions.USERS_GET)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.USERS_GET)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.USERS_EDIT)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.USERS_DELETE)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('verify/:otp')
  async verifyEmail(@Param('otp') otp: string) {
    const result = await this.userService.verifyEmail(otp);

    return { status: result ? 'sucess' : 'failure', message: null };
  }
}
