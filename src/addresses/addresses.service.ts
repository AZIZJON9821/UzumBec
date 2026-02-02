import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

import { OdooService } from '../odoo/odoo.service';

@Injectable()
export class AddressesService {
    constructor(
        private prisma: PrismaService,
        private odooService: OdooService,
    ) { }

    async syncFromOdoo() {
        const odooPartners = await this.odooService.findCustomers();
        // Only sync those with parent_id (child contacts/addresses)
        const addresses = odooPartners.filter(p => p.parent_id);
        let synced = 0;

        for (const oAddr of addresses) {
            // Find local user by odooId of parent
            const parentOdooId = oAddr.parent_id[0];
            const user = await this.prisma.user.findUnique({
                where: { odooId: parentOdooId },
            });

            if (user) {
                await this.prisma.address.upsert({
                    where: { odooId: oAddr.id },
                    update: {
                        city: oAddr.city || 'Odoo City',
                        district: oAddr.street2 || 'Odoo District',
                        street: oAddr.street || 'Odoo Street',
                        house: '0', // Placeholder
                    },
                    create: {
                        userId: user.id,
                        city: oAddr.city || 'Odoo City',
                        district: oAddr.street2 || 'Odoo District',
                        street: oAddr.street || 'Odoo Street',
                        house: '0',
                        odooId: oAddr.id,
                    },
                });
                synced++;
            }
        }
        return { syncedAddresses: synced };
    }

    async create(userId: string, dto: CreateAddressDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

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
