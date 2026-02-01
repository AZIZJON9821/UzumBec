import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'uuid-product-id' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: 'uuid-color-id' })
  @IsOptional()
  @IsUUID()
  colorId?: string;

  @ApiPropertyOptional({ example: 'uuid-size-id' })
  @IsOptional()
  @IsUUID()
  sizeId?: string;

  @ApiProperty({ example: 'IPHONE-15-PRO-QORA' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 12000000 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 10000000 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  stock: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateVariantDto {
  @ApiPropertyOptional({ example: 'IPHONE-15-PRO-QORA-NEW' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 11000000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 9000000 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
