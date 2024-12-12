import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/message/email.service';

@Injectable()
export class WebhookService {
  constructor(private readonly emailService: EmailService) {}

  async emailLocation(code: string, location: string, username: string) {
    const subject = 'Order Location Update';
    const html = `
      <p>Hi, ${username}</p>
      <p>Your order with code: <strong>${code}</strong> is now located at:</p>
      <p><span style="font-size:18px; font-weight:600;">${location}</span></p>
      <p>Thank you for shopping with us!</p>
      <p>Regards,<br />MyApp Team</p>
    `;

    await this.emailService.sendEmail({
      subject,
      recipients: [{ name: username, address: username }],
      html,
    });

    console.log('Email sent for location update:', {
      code,
      location,
      username,
    });
  }

  async orderSendEmail(code: string, location: string, username: string) {
    await this.emailLocation(code, location, username);

    return { message: 'Webhook processed successfully' };
  }
}
