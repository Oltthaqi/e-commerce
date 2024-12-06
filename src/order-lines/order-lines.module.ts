import { Module } from '@nestjs/common';
import { OrderLinesService } from './order-lines.service';
import { OrderLinesController } from './order-lines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLine } from './entities/order-line.entity';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderLine]),
    ProductsModule,
    OrdersModule,
  ],
  controllers: [OrderLinesController],
  providers: [OrderLinesService],
})
export class OrderLinesModule {}
