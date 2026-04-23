import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
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

  async findAll() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        basePrice: true,
        isActive: true,
        category: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
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

  async update(id: string, dto: UpdateProductDto) {
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
      data: {
        name: dto.name,
        description: dto.description,
        basePrice: dto.basePrice,
        categoryId: dto.categoryId,
        brandId: dto.brandId,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // 404 guard
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}