import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    @ApiOperation({ summary: 'Wishlistni ko’rish' })
    getWishlist(@CurrentUser() user: any) {
        return this.wishlistService.getWishlist(user.id);
    }

    @Post('toggle/:productId')
    @ApiOperation({ summary: 'Mahsulotni wishlistga qo’shish/o’chirish' })
    toggleWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
        return this.wishlistService.toggleWishlist(user.id, productId);
    }
}
