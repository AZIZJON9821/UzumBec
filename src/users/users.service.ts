import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

import { OdooService } from '../odoo/odoo.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private odooService: OdooService,
  ) { }

  async syncFromOdoo() {
    const odooPartners = await this.odooService.findCustomers();
    let synced = 0;

    for (const oPartner of odooPartners) {
      if (!oPartner.email && !oPartner.phone) continue;

      await this.prisma.user.upsert({
        where: { odooId: oPartner.id },
        update: {
          fullName: oPartner.name,
          email: oPartner.email || undefined,
          phone: oPartner.phone || `ODOO-${oPartner.id}`,
        },
        create: {
          fullName: oPartner.name,
          email: oPartner.email || undefined,
          phone: oPartner.phone || `ODOO-${oPartner.id}`,
          password: '', // Placeholder
          odooId: oPartner.id,
          isActive: true,
        },
      });
      synced++;
    }

    return { syncedUsers: synced };
  }

  async create(dto: CreateUserDto) {
    if (dto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('SUPER_ADMIN yaratish taqiqlangan');
    }

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { phone: dto.phone },
          dto.email ? { email: dto.email } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existing) {
      throw new ConflictException('Bu telefon raqam yoki email band');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
        isActive: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRT, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.role === Role.SUPER_ADMIN) {
      throw new ForbiddenException('SUPER_ADMIN roli berilishi mumkin emas');
    }

    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
