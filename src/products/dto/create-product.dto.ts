import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'The latest iPhone',
    description: 'Detailed description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Apple', description: 'Brand name' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'uuid-category-id', description: 'Category ID' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: 'uuid-seller-id', description: 'Seller ID' })
  @IsOptional()
  @IsString()
  sellerId?: string;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: 123, description: 'Odoo Template ID' })
  @IsOptional()
  @IsNumber()
  odooId?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'iPhone 15 Pro Max' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Apple' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'uuid-category-id' })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ProductStatus, example: ProductStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: 456 })
  @IsOptional()
  @IsNumber()
  odooId?: number;
}
