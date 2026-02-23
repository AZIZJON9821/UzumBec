import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreatePickupPointDto } from './dto/create-pickup-point.dto';
import { UpdatePickupPointDto } from './dto/update-pickup-point.dto';

@Injectable()
export class PickupPointsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createPickupPointDto: CreatePickupPointDto) {
        return this.prisma.pickupPoint.create({
            data: createPickupPointDto,
        });
    }

    async findAll(isActive?: boolean) {
        return this.prisma.pickupPoint.findMany({
            where: isActive !== undefined ? { isActive } : {},
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const pickupPoint = await this.prisma.pickupPoint.findUnique({
            where: { id },
        });
        if (!pickupPoint) {
            throw new NotFoundException(`Pickup point with ID ${id} not found`);
        }
        return pickupPoint;
    }

    async update(id: string, updatePickupPointDto: UpdatePickupPointDto) {
        await this.findOne(id);
        return this.prisma.pickupPoint.update({
            where: { id },
            data: updatePickupPointDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.pickupPoint.delete({
            where: { id },
        });
    }
}
