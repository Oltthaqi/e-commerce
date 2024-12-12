import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEmail } from 'class-validator';

export class WebhookPayloadDto {
  @ApiProperty()
  @IsNumber()
  code: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsEmail()
  userName: string;
}
