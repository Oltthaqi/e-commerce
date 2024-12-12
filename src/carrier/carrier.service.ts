import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { Repository } from 'typeorm';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class CarrierService {
  constructor(
    @InjectRepository(Carrier) private carrierRepository: Repository<Carrier>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
  ) {}

  async create(createCarrierDto: CreateCarrierDto) {
    const carrierE = await this.carrierRepository.findOne({
      where: { username: createCarrierDto.username },
    });
    if (carrierE) throw new UnauthorizedException('Carrier already exists');

    const carrier = this.carrierRepository.create(createCarrierDto);
    return this.carrierRepository.save(carrier);
  }

  async findAll() {
    return await this.carrierRepository.find();
  }

  findOne(id: number) {
    return this.carrierRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCarrierDto: UpdateCarrierDto) {
    const carrier = await this.carrierRepository.findOne({ where: { id } });
    if (!carrier) throw new NotFoundException(`Carrier not found`);
    Object.assign(carrier, updateCarrierDto);
    return this.carrierRepository.save(carrier);
  }

  async remove(id: number) {
    const carrier = await this.carrierRepository.findOne({ where: { id } });
    return this.carrierRepository.remove(carrier);
  }

  async GivecarrierOrder(orderId: number, carrierId: number) {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    const carrier = await this.carrierRepository.findOne({
      where: { id: carrierId },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!carrier) throw new NotFoundException('Carrier not found');
    order.carrier = carrier;

    return await this.orderRepository.save(order);
  }

  async checkCarrierOrderAccess(
    carrierId: number,
    code: string,
  ): Promise<boolean> {
    const order = await this.orderRepository.findOne({
      where: { code },
      relations: ['carrier'],
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.carrier.id !== carrierId) throw new UnauthorizedException();
    return !!order;
  }

  async findOneByUsername(username: string) {
    return this.carrierRepository.findOne({ where: { username } });
  }
}
