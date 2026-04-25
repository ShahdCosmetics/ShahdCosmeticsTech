import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let service: ProductsService;

  // Scoped inside describe — isolated between test runs
  let mockTx: {
    product: { create: jest.Mock };
    productVariant: { create: jest.Mock };
    inventory: { create: jest.Mock };
    productImage: { create: jest.Mock };
  };

  let mockPrisma: {
    product: { findUnique: jest.Mock; findMany: jest.Mock; update: jest.Mock; delete: jest.Mock };
    category: { findUnique: jest.Mock };
    brand: { findUnique: jest.Mock };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    // Reset mocks before every test
    mockTx = {
      product: { create: jest.fn() },
      productVariant: { create: jest.fn() },
      inventory: { create: jest.fn() },
      productImage: { create: jest.fn() },
    };

    mockPrisma = {
      product: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: { findUnique: jest.fn() },
      brand: { findUnique: jest.fn() },
      $transaction: jest.fn((cb) => cb(mockTx)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should throw NotFoundException if categoryId does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Rose Cream',
          basePrice: 2500,
          categoryId: 'bad-uuid',
          brandId: 'brand-uuid',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if brandId does not exist', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-uuid' });
      mockPrisma.brand.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Rose Cream',
          basePrice: 2500,
          categoryId: 'cat-uuid',
          brandId: 'bad-uuid',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create product, variant, and inventory atomically', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-uuid' });
      mockPrisma.brand.findUnique.mockResolvedValue({ id: 'brand-uuid' });
      mockTx.product.create.mockResolvedValue({ id: 'prod-uuid', name: 'Rose Cream' });
      mockTx.productVariant.create.mockResolvedValue({ id: 'variant-uuid' });
      mockTx.inventory.create.mockResolvedValue({});

      const result = await service.create({
        name: 'Rose Cream',
        basePrice: 2500,
        categoryId: 'cat-uuid',
        brandId: 'brand-uuid',
      });

      expect(result.name).toBe('Rose Cream');
      expect(mockTx.productVariant.create).toHaveBeenCalled();
      expect(mockTx.inventory.create).toHaveBeenCalledWith({
        data: { variantId: 'variant-uuid', quantity: 0 },
      });
    });

    it('should save imageUrl as primary product image if provided', async () => {
      mockPrisma.category.findUnique.mockResolvedValue({ id: 'cat-uuid' });
      mockPrisma.brand.findUnique.mockResolvedValue({ id: 'brand-uuid' });
      mockTx.product.create.mockResolvedValue({ id: 'prod-uuid', name: 'Rose Cream' });
      mockTx.productVariant.create.mockResolvedValue({ id: 'variant-uuid' });
      mockTx.inventory.create.mockResolvedValue({});
      mockTx.productImage.create.mockResolvedValue({});

      await service.create({
        name: 'Rose Cream',
        basePrice: 2500,
        categoryId: 'cat-uuid',
        brandId: 'brand-uuid',
        imageUrl: 'https://example.com/image.jpg',
      });

      expect(mockTx.productImage.create).toHaveBeenCalledWith({
        data: {
          productId: 'prod-uuid',
          url: 'https://example.com/image.jpg',
          isPrimary: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of products', async () => {
      mockPrisma.product.findMany.mockResolvedValue([
        { id: 'prod-uuid', name: 'Rose Cream', basePrice: 2500, isActive: true },
      ]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Rose Cream');
    });
  });

  describe('findOne', () => {
    it('should return product with flattened inventory', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'prod-uuid',
        name: 'Rose Cream',
        variants: [{ inventory: { quantity: 10 } }],
      });

      const result = await service.findOne('prod-uuid');
      expect(result.inventory).toEqual({ quantity: 10 });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('bad-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.update('bad-id', { basePrice: 3000 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update successfully', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'prod-uuid',
        variants: [{ inventory: { quantity: 0 } }],
      });
      mockPrisma.product.update.mockResolvedValue({
        id: 'prod-uuid',
        basePrice: 3000,
      });

      const result = await service.update('prod-uuid', { basePrice: 3000 });
      expect(result.basePrice).toBe(3000);
    });
  });

  describe('remove', () => {
    it('should delete and return success message', async () => {
      mockPrisma.product.findUnique.mockResolvedValue({
        id: 'prod-uuid',
        variants: [{ inventory: { quantity: 0 } }],
      });
      mockPrisma.product.delete.mockResolvedValue({});

      const result = await service.remove('prod-uuid');
      expect(result.message).toBe('Product deleted successfully');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('bad-id')).rejects.toThrow(NotFoundException);
    });
  });
});