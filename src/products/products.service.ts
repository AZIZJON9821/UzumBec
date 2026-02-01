import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OdooService } from '../odoo/odoo.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { CreateVariantDto, UpdateVariantDto } from './dto/variant.dto';
import { ProductStatus } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private odooService: OdooService,
  ) {}

  // ==========================================
  // ODOO SYNC
  // ==========================================
  async syncFromOdoo() {
    this.logger.log('Starting Odoo product sync...');

    // 1. Fetch templates from Odoo
    const odooProducts = await this.odooService.executeKw(
      'product.template',
      'search_read',
      [[]],
      {
        fields: ['name', 'list_price', 'description_sale', 'categ_id'],
        limit: 50,
      },
    );

    // 2. Fetch variants (product.product)
    const odooVariants = await this.odooService.executeKw(
      'product.product',
      'search_read',
      [[]],
      {
        fields: [
          'name',
          'lst_price',
          'code',
          'qty_available',
          'product_tmpl_id',
        ],
        limit: 100,
      },
    );

    let syncedCount = 0;
    let variantCount = 0;
    const templateMap = new Map();

    for (const oProduct of odooProducts) {
      try {
        const oCategoryId = oProduct.categ_id[0];
        const oCategoryName = oProduct.categ_id[1];

        const localCategory = await this.prisma.category.upsert({
          where: { odooId: oCategoryId },
          update: { name: oCategoryName },
          create: {
            name: oCategoryName,
            slug: this.slugify(oCategoryName) + '-' + oCategoryId,
            odooId: oCategoryId,
          },
        });

        const product = await this.prisma.product.upsert({
          where: { odooId: oProduct.id },
          update: {
            name: oProduct.name,
            description: oProduct.description_sale || '',
            categoryId: localCategory.id,
            status: ProductStatus.ACTIVE,
          },
          create: {
            name: oProduct.name,
            slug: this.slugify(oProduct.name) + '-' + oProduct.id,
            description: oProduct.description_sale || '',
            categoryId: localCategory.id,
            sellerId: 'system',
            odooId: oProduct.id,
            status: ProductStatus.ACTIVE,
          },
        });

        templateMap.set(oProduct.id, product.id);
        syncedCount++;
      } catch (err) {
        this.logger.error(
          `Failed to sync product ${oProduct.name}: ${err.message}`,
        );
      }
    }

    // Sync Variants
    for (const oVariant of odooVariants) {
      try {
        const templateId = oVariant.product_tmpl_id[0];
        const localProductId = templateMap.get(templateId);

        if (localProductId) {
          await this.prisma.productVariant.upsert({
            where: { odooId: oVariant.id },
            update: {
              price: oVariant.lst_price,
              sku: oVariant.code || `SKU-${oVariant.id}`,
              stock: Math.floor(oVariant.qty_available || 0),
              isActive: true,
            },
            create: {
              productId: localProductId,
              price: oVariant.lst_price,
              sku: oVariant.code || `SKU-${oVariant.id}`,
              stock: Math.floor(oVariant.qty_available || 0),
              odooId: oVariant.id,
              isActive: true,
            },
          });
          variantCount++;
        }
      } catch (err) {
        this.logger.error(
          `Failed to sync variant ${oVariant.name}: ${err.message}`,
        );
      }
    }

    return {
      message: 'Sync completed',
      products: syncedCount,
      variants: variantCount,
    };
  }

  // ==========================================
  // PRODUCT CRUD
  // ==========================================
  async createProduct(dto: CreateProductDto) {
    const slug = this.slugify(dto.name) + '-' + Date.now();
    return this.prisma.product.create({
      data: {
        ...dto,
        slug,
        sellerId: dto.sellerId || 'system',
      },
    });
  }

  async findAllProducts() {
    return this.prisma.product.findMany({
      where: { isDeleted: false },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async findOneProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: {
          include: { color: true, size: true },
        },
        reviews: true,
      },
    });
    if (!product) throw new NotFoundException('Mahsulot topilmadi');
    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async removeProduct(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  // ==========================================
  // VARIANT CRUD
  // ==========================================
  async createVariant(dto: CreateVariantDto) {
    return this.prisma.productVariant.create({
      data: dto,
    });
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    return this.prisma.productVariant.update({
      where: { id },
      data: dto,
    });
  }

  async removeVariant(id: string) {
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }

  // ==========================================
  // HELPERS
  // ==========================================
  private slugify(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
