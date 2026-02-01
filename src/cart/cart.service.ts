import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId: string) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                                images: { where: { isMain: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true,
                                    images: { where: { isMain: true } },
                                },
                            },
                        },
                    },
                },
            });
        }

        return cart;
    }

    async addItem(userId: string, dto: AddToCartDto) {
        const cart = await this.getCart(userId);

        const variant = await this.prisma.productVariant.findUnique({
            where: { id: dto.variantId },
            include: { product: true },
        });

        if (!variant) throw new NotFoundException('Mahsulot varianti topilmadi');

        if (!variant.isActive) throw new NotFoundException('Ushbu mahsulot hozirda nofaol');

        if (variant.stock < dto.quantity) throw new NotFoundException(`Omborda yetarli mahsulot yo'q. Qoldiq: ${variant.stock}`);

        const existingItem = await this.prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                variantId: dto.variantId,
            },
        });

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + dto.quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId: dto.variantId,
                quantity: dto.quantity,
            },
        });
    }

    async updateItem(itemId: string, dto: UpdateCartItemDto) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
        });

        if (!item) throw new NotFoundException('Savatchadagi maxsulot topilmadi');

        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
    }

    async removeItem(itemId: string) {
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }

    async clearCart(userId: string) {
        const cart = await this.getCart(userId);
        return this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
    }
}
