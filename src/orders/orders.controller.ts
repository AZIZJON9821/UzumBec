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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Buyurtma yaratish' })
    create(@Req() req: any, @Body() dto: CreateOrderDto) {
        return this.ordersService.create(req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Foydalanuvchi buyurtmalarini olish' })
    findAll(@Req() req: any) {
        return this.ordersService.findAll(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta buyurtmani ko’rish' })
    findOne(@Req() req: any, @Param('id') id: string) {
        return this.ordersService.findOne(id, req.user.id);
    }
}
