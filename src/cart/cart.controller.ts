import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @ApiOperation({ summary: 'Savatchani ko’rish' })
    getCart(@Req() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('add')
    @ApiOperation({ summary: 'Savatchaga mahsulot qo’shish' })
    addItem(@Req() req: any, @Body() dto: AddToCartDto) {
        return this.cartService.addItem(req.user.id, dto);
    }

    @Patch('item/:id')
    @ApiOperation({ summary: 'Savatchadagi mahsulot miqdorini o’zgartirish' })
    updateItem(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
        return this.cartService.updateItem(id, dto);
    }

    @Delete('item/:id')
    @ApiOperation({ summary: 'Savatchadan mahsulotni o’chirish' })
    removeItem(@Param('id') id: string) {
        return this.cartService.removeItem(id);
    }

    @Delete('clear')
    @ApiOperation({ summary: 'Savatchani tozalash' })
    clearCart(@CurrentUser() user: any) {
        return this.cartService.clearCart(user.id);
    }
}
