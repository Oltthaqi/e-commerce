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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
@ApiBearerAuth('access-token')
@Controller('categories')
@UseGuards(PermissionsGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @SetPermissions(UserPermissions.CATEGORIES)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @SetPermissions(UserPermissions.DEFAULT)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.DEFAULT)
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.CATEGORIES)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.CATEGORIES)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
