import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { SetPermissions } from 'src/auth/Decorators/metaData';
@ApiBearerAuth('access-token')
@Controller('products')
@UseGuards(PermissionsGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @SetPermissions(UserPermissions.PRODUCTS)
  @ApiProperty({ type: CreateProductDto })
  create(
    @Body() createProductDto: CreateProductDto,
    @Query('categoryIds') categoryIds: string,
  ) {
    if (!categoryIds) {
      throw new BadRequestException('categoryIds are required');
    }
    const categoryIdsArray = categoryIds
      .split(',')
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));
    return this.productsService.create(createProductDto, categoryIdsArray);
  }

  @Get()
  @SetPermissions(UserPermissions.PRODUCTS)
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @SetPermissions(UserPermissions.PRODUCTS)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @SetPermissions(UserPermissions.PRODUCTS)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @SetPermissions(UserPermissions.PRODUCTS)
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
