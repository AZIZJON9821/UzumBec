import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateReviewDto) {
        // 1. Check if product exists
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Mahsulot topilmadi');

        // 2. Create review
        const review = await this.prisma.review.create({
            data: {
                userId,
                productId: dto.productId,
                rating: dto.rating,
                comment: dto.comment,
            },
            include: { user: true },
        });

        // 3. Update product rating
        await this.updateProductRating(dto.productId);

        return review;
    }

    async findByProduct(productId: string) {
        return this.prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: { fullName: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    private async updateProductRating(productId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { productId },
            select: { rating: true },
        });

        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = totalRating / reviews.length;

            await this.prisma.product.update({
                where: { id: productId },
                data: { rating: averageRating },
            });
        }
    }
}
