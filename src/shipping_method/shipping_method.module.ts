import { Module } from '@nestjs/common';
import { ShippingMethodService } from './shipping_method.service';
import { ShippingMethodController } from './shipping_method.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingMethod } from './entities/shipping_method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethod])],
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService],
})
export class ShippingMethodModule {}
