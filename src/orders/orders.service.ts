import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto) {
    // 1. Get cart items
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { variant: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Savatcha bo’sh');
    }

    // 2. Calculate total amount
    let totalAmount = 0;
    cart.items.forEach((item) => {
      totalAmount += Number(item.variant.price) * item.quantity;
    });

    // 3. Create order
    const order = await this.prisma.order.create({
      data: {
        userId,
        addressId: dto.addressId,
        paymentMethod: dto.paymentMethod,
        totalAmount: totalAmount,
        items: {
          create: cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            priceAtPurchase: item.variant.price,
          })),
        },
      },
    });

    // 4. Clear cart
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  }

  async findAll(userId: string) {
    return this.prisma.order.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllOrders() {
    return this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            email: true,
          },
        },
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
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: { variant: true },
        },
        address: true,
      },
    });

    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }
}
