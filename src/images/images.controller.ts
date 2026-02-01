import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { CreateImageDto, UpdateImageDto } from './dto/image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Images (DB Records)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) { }

    @Post()
    @ApiOperation({ summary: 'Rasm ma’lumotini saqlash' })
    create(@Body() dto: CreateImageDto) {
        return this.imagesService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Variantga tegishli rasmlarni olish' })
    @ApiQuery({ name: 'variantId', required: true })
    findAll(@Query('variantId') variantId: string) {
        return this.imagesService.findAll(variantId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Bitta rasm ma’lumotini olish' })
    findOne(@Param('id') id: string) {
        return this.imagesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Rasm statusini yangilash (Main qilish)' })
    update(@Param('id') id: string, @Body() dto: UpdateImageDto) {
        return this.imagesService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Rasm ma’lumotini o’chirish' })
    remove(@Param('id') id: string) {
        return this.imagesService.remove(id);
    }
}
