import { IsOptional, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductFilterDto {
    @ApiPropertyOptional({ description: 'Kategoriya ID' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Qidiruv so\'zi' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Minimal narx' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @ApiPropertyOptional({ description: 'Maksimal narx' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @ApiPropertyOptional({ description: 'Rang IDlar', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    colorIds?: string[];

    @ApiPropertyOptional({ description: 'O\'lcham IDlar', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sizeIds?: string[];

    @ApiPropertyOptional({ description: 'Brand ID' })
    @IsOptional()
    @IsString()
    brandId?: string;

    @ApiPropertyOptional({
        description: 'Saralash',
        enum: ['popular', 'newest', 'price_asc', 'price_desc', 'rating']
    })
    @IsOptional()
    @IsEnum(['popular', 'newest', 'price_asc', 'price_desc', 'rating'])
    sortBy?: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'rating';

    @ApiPropertyOptional({ description: 'Limit', default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ description: 'Offset', default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    offset?: number;
}
