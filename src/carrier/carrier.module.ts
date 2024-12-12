import { Module } from '@nestjs/common';
import { CarrierService } from './carrier.service';
import { CarrierController } from './carrier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carrier } from './entities/carrier.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Carrier]), OrdersModule],
  controllers: [CarrierController],
  providers: [CarrierService],
  exports: [CarrierService, TypeOrmModule],
})
export class CarrierModule {}
