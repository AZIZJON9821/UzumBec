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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
import { ProductFilterDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // ==========================================
  // ODOO SYNC
  // ==========================================
  @Post('sync')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync products and variants from Odoo (Admin only)' })
  sync() {
    return this.productsService.syncFromOdoo();
  }

  // ==========================================
  // PRODUCT ENDPOINTS
  // ==========================================
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin/Moderator)' })
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filters' })
  findAll(@Query() filters: ProductFilterDto) {
    return this.productsService.findAllProducts(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin/Moderator)' })
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product - Soft delete (Admin only)' })
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }

  // ==========================================
  // VARIANT ENDPOINTS
  // ==========================================
  @Post('variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product variant (Admin/Moderator)' })
  createVariant(@Body() dto: CreateVariantDto) {
    return this.productsService.createVariant(dto);
  }

  @Patch('variants/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product variant (Admin/Moderator)' })
  updateVariant(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.productsService.updateVariant(id, dto);
  }

  @Delete('variants/:id')
  @ApiOperation({ summary: 'Delete product variant' })
  removeVariant(@Param('id') id: string) {
    return this.productsService.removeVariant(id);
  }
}
