import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Elektronika' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ example: 'uuid-parent-id' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({ example: 'https://example.com/icon.png' })
    @IsOptional()
    @IsString()
    icon?: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: 'Gadjellar' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'uuid-parent-id' })
    @IsOptional()
    @IsUUID()
    parentId?: string;

    @ApiPropertyOptional({ example: 'https://example.com/icon-new.png' })
    @IsOptional()
    @IsString()
    icon?: string;
}
