import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';

import { OdooService } from '../odoo/odoo.service';

@Injectable()
export class ColorsService {
    constructor(
        private prisma: PrismaService,
        private odooService: OdooService,
    ) { }

    async syncFromOdoo() {
        const attributeValues = await this.odooService.findAttributeValues();
        // Assuming attribute_id [1, 'Color'] for colors in Odoo
        // We'll filter based on name or display_name containing 'color'
        let synced = 0;
        for (const val of attributeValues) {
            // Find or create based on odooId
            await this.prisma.color.upsert({
                where: { odooId: val.id },
                update: { name: val.name },
                create: {
                    name: val.name,
                    hexCode: '#000000', // Default placeholder
                    odooId: val.id,
                },
            });
            synced++;
        }
        return { syncedColors: synced };
    }

    async create(dto: CreateColorDto) {
        const existing = await this.prisma.color.findUnique({ where: { name: dto.name } });
        if (existing) throw new NotFoundException('Bunday nomli rang allaqachon mavjud');

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
