import { Module } from '@nestjs/common';
import { ShippingMethodService } from './shipping_method.service';
import { ShippingMethodController } from './shipping_method.controller';

@Module({
  controllers: [ShippingMethodController],
  providers: [ShippingMethodService],
})
export class ShippingMethodModule {}
