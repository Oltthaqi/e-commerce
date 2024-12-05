import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingMethod } from './entities/shipping_method.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShippingMethodService {
  constructor(
    @InjectRepository(ShippingMethod)
    private shippingMethodRepo: Repository<ShippingMethod>,
  ) {}
  async create(createShippingMethodDto: CreateShippingMethodDto) {
    const shippingMethod = await this.shippingMethodRepo.findOne({
      where: { name: createShippingMethodDto.name },
    });

    if (shippingMethod) {
      throw new BadRequestException('Shipping method already exists');
    }
    const shippingMethodToAdd = await this.shippingMethodRepo.create(
      createShippingMethodDto,
    );
    return await this.shippingMethodRepo.save(shippingMethodToAdd);
  }

  async findAll() {
    return await this.shippingMethodRepo.find();
  }

  findOne(id: number) {
    return this.shippingMethodRepo.findOne({ where: { id } });
  }

  async update(id: number, updateShippingMethodDto: UpdateShippingMethodDto) {
    const shippingMethod = await this.shippingMethodRepo.findOne({
      where: { id },
    });

    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found');
    }
    Object.assign(shippingMethod, updateShippingMethodDto);
    return this.shippingMethodRepo.save(shippingMethod);
  }

  async remove(id: number) {
    const shippingMethod = await this.shippingMethodRepo.findOne({
      where: { id },
    });
    if (!shippingMethod) {
      throw new NotFoundException('Shipping method not found');
    }
    return this.shippingMethodRepo.remove(shippingMethod);
  }
}
