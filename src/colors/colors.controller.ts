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
import { ColorsService } from './colors.service';
import { CreateColorDto, UpdateColorDto } from './dto/color.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
    constructor(private readonly colorsService: ColorsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Rang yaratish (Admin/Moderator)' })
    create(@Body() dto: CreateColorDto) {
        return this.colorsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Barcha ranglarni olish' })
    findAll() {
        return this.colorsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta rangni olish' })
    findOne(@Param('id') id: string) {
        return this.colorsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MODERATOR)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Rangni tahrirlash (Admin/Moderator)' })
    update(@Param('id') id: string, @Body() dto: UpdateColorDto) {
        return this.colorsService.update(id, dto);
    }

    @Post('sync')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Ranglarni Odoo dan sinxronizatsiya qilish (Admin only)' })
    syncFromOdoo() {
        return this.colorsService.syncFromOdoo();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Rangni o’chirish' })
    remove(@Param('id') id: string) {
        return this.colorsService.remove(id);
    }
}
