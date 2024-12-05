import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { ProductStatus } from './enum/products.status.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto, categories: number[]) {
    const categoriesToAdd = await this.categoryRepository.find({
      where: {
        id: In(categories),
      },
    });

    const product = this.productRepository.create({
      ...createProductDto,
      status: ProductStatus.ACTIVE,
      categories: categoriesToAdd,
    });

    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['categories'] });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    Object.assign(product, updateProductDto);

    return this.productRepository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
