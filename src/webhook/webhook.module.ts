import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { MessageModule } from 'src/message/message.module';
import { CarrierModule } from 'src/carrier/carrier.module';

@Module({
  imports: [MessageModule, CarrierModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
