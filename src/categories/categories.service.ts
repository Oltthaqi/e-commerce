import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const cat = await this.categoryRepo.findOne({
      where: { name: createCategoryDto.name },
    });
    if (cat) {
      throw new BadRequestException('Category already exists');
    }
    const category = this.categoryRepo.create(createCategoryDto);
    return this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findOne(id: number) {
    return await this.categoryRepo.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(cat, updateCategoryDto);
    return await this.categoryRepo.save(cat);
  }

  async remove(id: number) {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepo.remove(cat);
  }
}
