import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@Injectable()
export class AddressesService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateAddressDto) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.create({
            data: {
                ...dto,
                userId,
            },
        });
    }

    async findAll(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }

    async findOne(id: string) {
        const address = await this.prisma.address.findUnique({
            where: { id },
        });
        if (!address) throw new NotFoundException('Manzil topilmadi');
        return address;
    }

    async update(id: string, dto: UpdateAddressDto, userId: string) {
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.address.delete({
            where: { id },
        });
    }
}
