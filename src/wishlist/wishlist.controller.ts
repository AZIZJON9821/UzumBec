import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    @ApiOperation({ summary: 'Wishlistni ko’rish' })
    getWishlist(@Req() req: any) {
        return this.wishlistService.getWishlist(req.user.id);
    }

    @Post('toggle/:productId')
    @ApiOperation({ summary: 'Mahsulotni wishlistga qo’shish/o’chirish' })
    toggleWishlist(@Req() req: any, @Param('productId') productId: string) {
        return this.wishlistService.toggleWishlist(req.user.id, productId);
    }
}
