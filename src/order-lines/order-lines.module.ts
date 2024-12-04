import { Module } from '@nestjs/common';
import { OrderLinesService } from './order-lines.service';
import { OrderLinesController } from './order-lines.controller';

@Module({
  controllers: [OrderLinesController],
  providers: [OrderLinesService],
})
export class OrderLinesModule {}
