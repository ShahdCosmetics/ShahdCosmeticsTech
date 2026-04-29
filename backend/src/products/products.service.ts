import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '@prisma/client';
import { ProductQueryDto } from './dto/product-query.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // Verify categoryId exists before creating the product
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Category with id "${dto.categoryId}" not found`,
      );
    }

    // Verify brandId exists before creating the product
    const brand = await this.prisma.brand.findUnique({
      where: { id: dto.brandId },
    });
    if (!brand) {
      throw new NotFoundException(
        `Brand with id "${dto.brandId}" not found`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Generate a URL-friendly slug from the product name
      const slug = dto.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

      const product = await tx.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          basePrice: dto.basePrice,
          categoryId: dto.categoryId,
          brandId: dto.brandId,
          slug,
        },
      });

      // Create a default variant so inventory can be tracked immediately
      const variant = await tx.productVariant.create({
        data: {
          productId: product.id,
          sku: `${slug}-default`,
        },
      });

      // Attach inventory to the default variant with zero initial stock
      await tx.inventory.create({
        data: {
          variantId: variant.id,
          quantity: 0,
        },
      });

      // If imageUrl provided, save it as the primary product image
      if (dto.imageUrl) {
        await tx.productImage.create({
          data: {
            productId: product.id,
            url: dto.imageUrl,
            isPrimary: true,
          },
        });
      }

      return product;
    });
  }

  async findAll(query: ProductQueryDto): Promise<{
    data: {
      id: string;
      name: string;
      basePrice: Decimal;
      isActive: boolean;
      isFeatured: boolean;
      categoryId: string;
      ratingAvg: Decimal | null;
      reviewCount: number;
      primaryImage: string | null;
    }[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { page, limit, categoryId } = query;
    const skip = (page - 1) * limit;

    // Validate the categoryId exists before querying products
    if (categoryId !== undefined) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with id "${categoryId}" not found`);
      }
    }

    const where = {
      isActive: true,
      ...(categoryId !== undefined && { categoryId }),
    };

    // Run count and findMany in parallel — single round-trip to the database
    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      }),
    ]);

    const data = products.map((product) => ({
      id: product.id,
      name: product.name,
      basePrice: product.basePrice,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
      ratingAvg: product.ratingAvg,
      reviewCount: product.reviewCount,
      primaryImage: product.images[0]?.url ?? null,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Partial<Product> & { inventory: { quantity: number } }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        // Get inventory from the first variant (default variant)
        variants: {
          take: 1,
          include: {
            inventory: { select: { quantity: true } },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    // Flatten inventory so response matches the API contract
    const { variants, ...rest } = product;
    return {
      ...rest,
      inventory: variants[0]?.inventory ?? { quantity: 0 },
    };
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    await this.findOne(id); // 404 guard

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with id "${dto.categoryId}" not found`,
        );
      }
    }

    if (dto.brandId) {
      const brand = await this.prisma.brand.findUnique({
        where: { id: dto.brandId },
      });
      if (!brand) {
        throw new NotFoundException(
          `Brand with id "${dto.brandId}" not found`,
        );
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: dto, 
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id); // 404 guard
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}