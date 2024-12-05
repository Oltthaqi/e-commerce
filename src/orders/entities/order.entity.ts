import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/Order.status.enum';
import { User } from 'src/user/entities/user.entity';
import { ShippingMethod } from 'src/shipping_method/entities/shipping_method.entity';
import { OrderLine } from 'src/order-lines/entities/order-line.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  userId: number;
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    eager: true,
  })
  user: User;

  shippingMethodId: number;
  @ManyToOne(
    () => ShippingMethod,
    (shipping_method) => shipping_method.orders,
    { eager: true },
  )
  shipping_method: ShippingMethod;

  @CreateDateColumn()
  created_At: Date;

  @UpdateDateColumn()
  updated_At: Date;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @OneToMany(() => OrderLine, (order_line) => order_line.order, {
    cascade: true,
  })
  orderLines: OrderLine[];
}
