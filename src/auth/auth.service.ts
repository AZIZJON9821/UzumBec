import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  SendOtpDto,
  VerifyOtpDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { PrismaService } from 'src/database/prisma.service';

import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) { }

  // 1. Send OTP
  async sendOtp(dto: SendOtpDto) {
    const { phone, email } = dto;

    if (!phone && !email) {
      throw new BadRequestException(
        'Telefon raqam yoki Email kiritilishi shart',
      );
    }

    // Mock OTP generation
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5); // 5 min expiry

    // Find user by either phone or email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as import('@prisma/client').Prisma.UserWhereInput[],
      },
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode: otp,
          otpExpires: expires,
        },
      });

      // Send via Email if user has email (either from DTO or DB)
      const targetEmail = email || user.email;
      if (targetEmail) {
        await this.mailService.sendOtp(targetEmail, otp);
      }

      // Simulation of SMS
      if (user.phone) {
        console.log(`[OTP] Phone: ${user.phone}, Code: ${otp}`);
      }

      return { message: 'OTP kod yuborildi' };
    } else {
      // New user creation only possible with phone
      if (!phone) {
        throw new BadRequestException(
          "Foydalanuvchi topilmadi. Avval telefon orqali ro'yxatdan o'ting.",
        );
      }

      await this.prisma.user.create({
        data: {
          phone,
          email,
          otpCode: otp,
          otpExpires: expires,
          password: '', // Placeholder
          role: 'CUSTOMER',
          isActive: false, // Default is false for OTP flow
        },
      });

      if (email) {
        await this.mailService.sendOtp(email, otp);
      }
      console.log(`[OTP] Phone: ${phone}, Code: ${otp}`);
      return { message: 'Yangi foydalanuvchi uchun OTP kod yuborildi' };
    }
  }

  // 1.2 Login with Password
  async login(dto: import('./dto/auth.dto').LoginDto) {
    const { phone, email, password } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as import('@prisma/client').Prisma.UserWhereInput[],
      },
    });

    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi');
    }

    if (!user.isActive) {
      throw new BadRequestException(
        'Foydalanuvchi faol emas. Iltimos OTP orqali tasdiqlang.',
      );
    }

    if (!user.password) {
      throw new BadRequestException("Foydalanuvchi paroli o'rnatilmagan");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Parol noto'g'ri");
    }

    return this.signToken(user.id, user.phone, user.role);
  }

  // 2. Verify OTP & Register/Login (Simplified)
  async verifyOtpAndLogin(dto: VerifyOtpDto) {
    const { phone, email, otp } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as import('@prisma/client').Prisma.UserWhereInput[],
      },
    });

    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi');
    }

    if (
      user.otpCode !== otp ||
      !user.otpExpires ||
      new Date() > user.otpExpires
    ) {
      throw new BadRequestException("OTP kod noto'g'ri yoki muddati o'tgan");
    }

    // Clear OTP
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: null,
        otpExpires: null,
        isActive: true,
        // Set verification flags based on how they logged in
        isPhoneVerified: !!phone || (user as any).isPhoneVerified,
        isEmailVerified: !!email || (user as any).isEmailVerified,
      },
    });

    return this.signToken(user.id, user.phone, user.role);
  }

  // 3. Register (Full)
  async register(dto: RegisterDto) {
    // Check email uniqueness if provided
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      const existingUserByPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });

      if (
        existingEmail &&
        (!existingUserByPhone || existingEmail.id !== existingUserByPhone.id)
      ) {
        throw new BadRequestException('Bu email allaqachon band');
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (user && user.isActive && user.password) {
      throw new BadRequestException('Foydalanuvchi allaqachon mavjud');
    }

    // If user exists (from sendOtp) but is not active/full, update it.
    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: dto.fullName,
          email: dto.email,
          password: dto.password ? await bcrypt.hash(dto.password, 10) : '',
          // isActive remains false until OTP verified?
          // Or if they register, they might need to verify phone.
        },
      });
      return {
        message:
          "Foydalanuvchi ma'lumotlari yangilandi, iltimos OTP kodni tasdiqlang",
      };
    }

    // Create new inactive user
    await this.prisma.user.create({
      data: {
        phone: dto.phone,
        fullName: dto.fullName,
        email: dto.email,
        password: dto.password ? await bcrypt.hash(dto.password, 10) : '',
        role: 'CUSTOMER',
        isActive: false,
      },
    });

    return {
      message: "Ro'yxatdan o'tish muvaffaqiyatli, iltimos OTP kodni tasdiqlang",
    };
  }

  // 4. Forgot Password Logic included in Send OTP (it works for both).

  // 5. Reset Password
  async resetPassword(dto: ResetPasswordDto) {
    const { phone, email, otp, newPassword } = dto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          phone ? { phone } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as import('@prisma/client').Prisma.UserWhereInput[],
      },
    });

    if (
      !user ||
      user.otpCode !== otp ||
      !user.otpExpires ||
      new Date() > user.otpExpires
    ) {
      throw new BadRequestException("OTP kod noto'g'ri");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpires: null,
      },
    });

    return { message: 'Parol muvaffaqiyatli yangilandi' };
  }

  // Helper
  async signToken(userId: string, phone: string, role: string) {
    const payload = { sub: userId, phone, role };
    const secret = process.env.JWT_SECRET || 'supersecret'; // Fallback

    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: '7d',
    });

    // Update RT in DB
    await this.updateRtHash(userId, refreshToken);

    return { accessToken: token, refreshToken ,role};
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRT: hash },
    });
  }
}
