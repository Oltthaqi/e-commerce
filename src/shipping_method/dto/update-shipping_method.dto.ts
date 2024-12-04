import { PartialType } from '@nestjs/swagger';
import { CreateShippingMethodDto } from './create-shipping_method.dto';

export class UpdateShippingMethodDto extends PartialType(CreateShippingMethodDto) {}
