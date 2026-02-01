import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
    constructor(private readonly addressesService: AddressesService) { }

    @Post()
    @ApiOperation({ summary: 'Yangi manzil qo’shish' })
    create(@Req() req: any, @Body() dto: CreateAddressDto) {
        return this.addressesService.create(req.user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Foydalanuvchi manzillarini olish' })
    findAll(@Req() req: any) {
        return this.addressesService.findAll(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta manzilni olish' })
    findOne(@Param('id') id: string) {
        return this.addressesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Manzilni tahrirlash' })
    update(
        @Req() req: any,
        @Param('id') id: string,
        @Body() dto: UpdateAddressDto,
    ) {
        return this.addressesService.update(id, dto, req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Manzilni o’chirish' })
    remove(@Param('id') id: string) {
        return this.addressesService.remove(id);
    }
}
