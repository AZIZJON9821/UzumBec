import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    // Payload: { sub: userId, phone, role, ... }
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Foydalanuvchi faol emas');
    }

    // Attach user to request
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRT, ...result } = user;
    return result;
  }
}
