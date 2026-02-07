import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async getWishlist(userId: string) {
        let wishlist = await this.prisma.wishlist.findUnique({
            where: { userId },
            include: {
                products: {
                    include: {
                        variants: {
                            include: { images: { where: { isMain: true } } },
                        },
                    },
                },
            },
        });

        if (!wishlist) {
            wishlist = await this.prisma.wishlist.create({
                data: { userId },
                include: {
                    products: {
                        include: {
                            variants: {
                                include: { images: { where: { isMain: true } } },
                            },
                        },
                    },
                },
            });
        }

        return wishlist;
    }

    async toggleWishlist(userId: string, productId: string) {
        const wishlist = await this.getWishlist(userId);
        const isProductInWishlist = wishlist.products.some(
            (p) => p.id === productId,
        );

        if (isProductInWishlist) {
            await this.prisma.wishlist.update({
                where: { userId },
                data: {
                    products: {
                        disconnect: { id: productId },
                    },
                },
            });
        } else {
            await this.prisma.wishlist.update({
                where: { userId },
                data: {
                    products: {
                        connect: { id: productId },
                    },
                },
            });
        }
        return this.getWishlist(userId);
    }
}
