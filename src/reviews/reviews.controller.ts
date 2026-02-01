import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    @ApiOperation({ summary: 'Sharh qoldirish' })
    create(@Req() req: any, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(req.user.id, dto);
    }

    @Get('product/:productId')
    @ApiOperation({ summary: 'Mahsulot sharhlarini olish' })
    findByProduct(@Param('productId') productId: string) {
        return this.reviewsService.findByProduct(productId);
    }
}
