// src/database/seeds/admin.seed.ts
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) { }

  async onApplicationBootstrap() {
    await this.seedSuperAdmin();
  }

  async seedSuperAdmin() {
    const phone = process.env.SUPER_ADMIN_PHONE;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!phone || !password) {
      console.log(
        'Use SUPER_ADMIN_PHONE and SUPER_ADMIN_PASSWORD env vars to create Super Admin',
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.upsert({
      where: { phone },
      update: {
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
      create: {
        phone,
        password: hashedPassword,
        fullName: 'Super Admin',
        role: Role.SUPER_ADMIN,
        isActive: true,
      },
    });

    console.log('Super Admin created successfully.');
  }
}
