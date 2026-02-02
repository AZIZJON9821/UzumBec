import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';

import { OdooService } from '../odoo/odoo.service';

@Injectable()
export class SizesService {
    constructor(
        private prisma: PrismaService,
        private odooService: OdooService,
    ) { }

    async syncFromOdoo() {
        const attributeValues = await this.odooService.findAttributeValues();
        let synced = 0;
        for (const val of attributeValues) {
            await this.prisma.size.upsert({
                where: { odooId: val.id },
                update: { name: val.name },
                create: {
                    name: val.name,
                    odooId: val.id,
                },
            });
            synced++;
        }
        return { syncedSizes: synced };
    }

    async create(dto: CreateSizeDto) {
        const existing = await this.prisma.size.findUnique({ where: { name: dto.name } });
        if (existing) throw new NotFoundException('Bunday nomli o’lcham allaqachon mavjud');

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
