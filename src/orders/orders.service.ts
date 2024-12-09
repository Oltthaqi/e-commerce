import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/Order.status.enum';
import { ShippingMethod } from 'src/shipping_method/entities/shipping_method.entity';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/message/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(ShippingMethod)
    private shippingMethodRepo: Repository<ShippingMethod>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
  ) {}
  async create(userId: number, shippingMethodId: number) {
    const shippingMethod = await this.shippingMethodRepo.findOne({
      where: { id: shippingMethodId },
    });
    const order = await this.orderRepo.create({
      user: { id: userId },
      shipping_method: { id: shippingMethodId },
      userId,
      shippingMethodId,
      created_At: new Date(),
      updated_At: new Date(),
      status: OrderStatus.PENDING,
      total: shippingMethod.flat_rate,
    });

    const user = await this.userRepo.findOne({ where: { id: userId } });

    await this.emailService.sendEmail({
      subject: 'e-commerce - Order created',
      recipients: [{ name: user.username ?? '', address: user.username }],
      html: `<p>Hi ${user.username ?? 'User'},</p>
         <p>Your order status has been Created ${order.id}. The current status is: <br />
         <span style="font-size:24px; font-weight:700;">${order.status}</span></p>
          <p>Order made at ${order.created_At}</p>
         <p>Thank you for shopping with us!</p>
         <p>Regards,<br />MyApp Team</p>`,
    });
    return await this.orderRepo.save(order);
  }

  async updateTotal(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['orderLines'],
    });
    order.total = order.orderLines.reduce((acc, orderLine) => {
      return acc + orderLine.total * orderLine.quantity;
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

    const user = await this.userRepo.findOne({ where: { id: order.userId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    updateOrderDto.updatedAt = new Date();
    Object.assign(order, updateOrderDto);

    await this.emailService.sendEmail({
      subject: 'e-commerce - Order status changed',
      recipients: [{ name: user.username ?? '', address: user.username }],
      html: `<p>Hi ${user.username ?? 'User'},</p>
         <p>Your order status has been updated. The current status is: <br />
         <span style="font-size:24px; font-weight:700;">${order.status}</span></p>
         <p>Thank you for shopping with us!</p>
         <p>Regards,<br />MyApp Team</p>`,
    });

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
