import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const slug = this.slugify(dto.name) + '-' + Date.now();
        return this.prisma.category.create({
            data: {
                ...dto,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            include: {
                children: true,
                _count: {
                    select: { products: true },
                },
            },
            where: { parentId: null }, // Faqat asosiy kategoriyalarni qaytarish (agar daraxt ko'rinishida kerak bo'lsa)
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: true,
            },
        });
        if (!category) throw new NotFoundException('Kategoriya topilmadi');
        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        return this.prisma.category.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        return this.prisma.category.delete({
            where: { id },
        });
    }

    private slugify(text: string) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}
