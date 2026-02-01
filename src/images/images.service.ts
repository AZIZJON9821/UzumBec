import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateImageDto, UpdateImageDto } from './dto/image.dto';

@Injectable()
export class ImagesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateImageDto) {
        if (dto.isMain) {
            await this.prisma.image.updateMany({
                where: { productVariantId: dto.productVariantId },
                data: { isMain: false },
            });
        }

        return this.prisma.image.create({
            data: dto,
        });
    }

    async findAll(productVariantId: string) {
        return this.prisma.image.findMany({
            where: { productVariantId },
            orderBy: { isMain: 'desc' },
        });
    }

    async findOne(id: string) {
        const image = await this.prisma.image.findUnique({
            where: { id },
        });
        if (!image) throw new NotFoundException('Rasm topilmadi');
        return image;
    }

    async update(id: string, dto: UpdateImageDto) {
        const image = await this.prisma.image.findUnique({ where: { id } });
        if (!image) throw new NotFoundException('Rasm topilmadi');

        if (dto.isMain) {
            await this.prisma.image.updateMany({
                where: { productVariantId: image.productVariantId },
                data: { isMain: false },
            });
        }

        return this.prisma.image.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.image.delete({
            where: { id },
        });
    }
}
