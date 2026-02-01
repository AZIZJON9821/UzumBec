import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================================
  // ODOO SYNC
  // ==========================================
  @Post('sync')
  @ApiOperation({ summary: 'Sync products and variants from Odoo' })
  sync() {
    return this.productsService.syncFromOdoo();
  }

  // ==========================================
  // PRODUCT ENDPOINTS
  // ==========================================
  @Post()
  @ApiOperation({ summary: 'Create new product' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  findAll() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product (Soft delete)' })
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }

  // ==========================================
  // VARIANT ENDPOINTS
  // ==========================================
  @Post('variants')
  @ApiOperation({ summary: 'Create new product variant' })
  createVariant(@Body() dto: CreateVariantDto) {
    return this.productsService.createVariant(dto);
  }

  @Patch('variants/:id')
  @ApiOperation({ summary: 'Update product variant' })
  updateVariant(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.productsService.updateVariant(id, dto);
  }

  @Delete('variants/:id')
  @ApiOperation({ summary: 'Delete product variant' })
  removeVariant(@Param('id') id: string) {
    return this.productsService.removeVariant(id);
  }
}
