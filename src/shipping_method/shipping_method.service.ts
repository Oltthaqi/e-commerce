import { Injectable } from '@nestjs/common';
import { CreateShippingMethodDto } from './dto/create-shipping_method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping_method.dto';

@Injectable()
export class ShippingMethodService {
  create(createShippingMethodDto: CreateShippingMethodDto) {
    return 'This action adds a new shippingMethod';
  }

  findAll() {
    return `This action returns all shippingMethod`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shippingMethod`;
  }

  update(id: number, updateShippingMethodDto: UpdateShippingMethodDto) {
    return `This action updates a #${id} shippingMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} shippingMethod`;
  }
}
