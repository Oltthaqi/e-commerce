import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookPayloadDto } from './dto/Webhook.payload.dto';
import { PermissionsGuard } from 'src/auth/Guards/PermissionsGuard.guard';
import { SetPermissions } from 'src/auth/Decorators/metaData';
import { UserPermissions } from 'src/permissions/enum/User-Permissions.enum';
import { CarrierGuard } from 'src/auth/Guards/carrier.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('webhook')
@UseGuards(PermissionsGuard)
@SetPermissions(UserPermissions.ORDERS_GET)
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @Post('order-location')
  @UseGuards(CarrierGuard)
  async handleOrderLocationWebhook(@Body() body: WebhookPayloadDto) {
    const { code, location, userName } = body;
    return this.webhookService.orderSendEmail(code, location, userName);
  }
}
