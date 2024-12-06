import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderLine } from './entities/order-line.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class OrderLinesService {
  constructor(
    @InjectRepository(OrderLine)
    private orderLineRepository: Repository<OrderLine>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    private readonly ordersService: OrdersService,
  ) {}
  async create(orderId: number, productId: number) {
    const orderLineExists = await this.orderLineRepository.findOne({
      where: {
        order: { id: orderId },
        product: { id: productId },
      },
    });

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!orderLineExists) {
      const orderLine = await this.orderLineRepository.create({
        order: { id: orderId },
        product: { id: productId },
        quantity: 1,
        price: product.price,
        total: product.price,
      });

      const ordLine = await this.orderLineRepository.save(orderLine);

      await this.ordersService.updateTotal(orderId);

      return ordLine;
    }
    orderLineExists.total += product.price;
    orderLineExists.quantity += 1;

    const ordLine = await this.orderLineRepository.save(orderLineExists);

    this.ordersService.updateTotal(orderId);

    return ordLine;
  }

  findAll() {
    return this.orderLineRepository.find();
  }

  findOne(id: number) {
    return this.orderLineRepository.findOne({ where: { id } });
  }

  async findByOrderId(orderId: number, userId: number) {
    const orderLines = await this.orderLineRepository.find({
      where: {
        order: { id: orderId },
      },
      relations: ['order'],
    });
    if (!orderLines) {
      throw new NotFoundException('OrderLines not found');
    }
    if (orderLines[0].order.userId !== userId) {
      throw new NotFoundException('OrderLines not found');
    }
    return orderLines;
  }

  async remove(id: number) {
    const orderLine = await this.orderLineRepository.findOne({
      where: { id },
      relations: ['order'],
    });
    if (!orderLine) {
      throw new NotFoundException('OrderLine not found');
    }

    if (orderLine.quantity > 1) {
      orderLine.quantity -= 1;

      const saveorder = await this.orderLineRepository.save(orderLine);
      console.log(saveorder);

      await this.ordersService.updateTotal(saveorder.order.id);
      return saveorder;
    }
    const remove = await this.orderLineRepository.remove(orderLine);

    await this.ordersService.updateTotal(remove.order.id);

    return remove;
  }
}
