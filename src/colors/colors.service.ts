import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';

@Injectable()
export class ColorsService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateColorDto) {
        return this.prisma.color.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.color.findMany();
    }

    async findOne(id: string) {
        const color = await this.prisma.color.findUnique({
            where: { id },
        });
        if (!color) throw new NotFoundException('Rang topilmadi');
        return color;
    }

    async update(id: string, dto: UpdateColorDto) {
        return this.prisma.color.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.color.delete({
            where: { id },
        });
    }
}
