import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/Order.status.enum';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepo: Repository<Order>) {}
  async create(userId: number, shippingMethodId: number) {
    console.log(userId, shippingMethodId);

    const order = await this.orderRepo.create({
      userId,
      shippingMethodId,
      created_At: new Date(),
      updated_At: new Date(),
      status: OrderStatus.PENDING,
      total: 0,
    });
    return await this.orderRepo.save(order);
  }

  async updateTotal(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderLines'],
    });
    order.total = order.orderLines.reduce((acc, orderLine) => {
      return acc + orderLine.total;
    }, 0);

    return this.orderRepo.save(order);
  }

  findAll() {
    // do pagination

    return this.orderRepo.find();
  }

  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    updateOrderDto.updatedAt = new Date();
    Object.assign(order, updateOrderDto);

    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.orderRepo.remove(order);
  }
}
