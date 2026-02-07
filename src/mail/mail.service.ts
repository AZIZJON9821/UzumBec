import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendOtp(email: string, otp: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${otp}`,
        html: `<b>Your verification code is: ${otp}</b>`,
      });
      console.log(`[MailService] Email sent to ${email} with OTP: ${otp}`);
    } catch (e) {
      console.error(`[MailService] Failed to send email to ${email}. OTP was: ${otp}`, e);
      // Fallback log for development
      console.log(`[MailService] DEV MODE OTP for ${email}: ${otp}`);
    }
  }
}
