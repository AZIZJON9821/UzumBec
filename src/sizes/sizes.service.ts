import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';

@Injectable()
export class SizesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateSizeDto) {
        return this.prisma.size.create({
            data: dto,
        });
    }

    async findAll() {
        return this.prisma.size.findMany();
    }

    async findOne(id: string) {
        const size = await this.prisma.size.findUnique({
            where: { id },
        });
        if (!size) throw new NotFoundException('O’lcham topilmadi');
        return size;
    }

    async update(id: string, dto: UpdateSizeDto) {
        return this.prisma.size.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.size.delete({
            where: { id },
        });
    }
}
