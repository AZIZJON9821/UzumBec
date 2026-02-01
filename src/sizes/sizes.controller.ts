import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SizesService } from './sizes.service';
import { CreateSizeDto, UpdateSizeDto } from './dto/size.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sizes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sizes')
export class SizesController {
    constructor(private readonly sizesService: SizesService) { }

    @Post()
    @ApiOperation({ summary: 'O’lcham yaratish' })
    create(@Body() dto: CreateSizeDto) {
        return this.sizesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Barcha o’lchamlarni olish' })
    findAll() {
        return this.sizesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta o’lchamni olish' })
    findOne(@Param('id') id: string) {
        return this.sizesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'O’lchamni tahrirlash' })
    update(@Param('id') id: string, @Body() dto: UpdateSizeDto) {
        return this.sizesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'O’lchamni o’chirish' })
    remove(@Param('id') id: string) {
        return this.sizesService.remove(id);
    }
}
