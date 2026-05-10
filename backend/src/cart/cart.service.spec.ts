import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CartService', () => {
  let service: CartService;

  let mockPrisma: {
    cart: { findUnique: jest.Mock; upsert: jest.Mock };
    cartItem: {
      findFirst: jest.Mock;
      upsert: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    productVariant: { findUnique: jest.Mock };
  };

  beforeEach(async () => {
    mockPrisma = {
      cart: {
        findUnique: jest.fn(),
        upsert: jest.fn(),
      },
      cartItem: {
        findFirst: jest.fn(),
        upsert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      productVariant: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should return cart with items for authenticated user', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({
        id: 1,
        items: [
          {
            id: 4,
            variantId: 'variant-uuid',
            quantity: 2,
            variant: {
              product: {
                name: 'Rose Lip Gloss',
                basePrice: { mul: jest.fn().mockReturnValue({ toFixed: () => '25.98' }) },
                images: [{ url: 'https://cdn.example.com/rose.jpg' }],
              },
            },
          },
        ],
      });

      const result = await service.getCart('user-uuid');

      expect(result.cartId).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].productName).toBe('Rose Lip Gloss');
      expect(result.items[0].quantity).toBe(2);
    });

    it('should return empty cart when user has no cart yet', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue(null);

      const result = await service.getCart('user-uuid');

      expect(result.cartId).toBeNull();
      expect(result.items).toHaveLength(0);
      expect(result.totalAmount).toBe('0.00');
    });
  });

  describe('addItem', () => {
    it('should create cart automatically if user has no cart yet', async () => {
      mockPrisma.productVariant.findUnique.mockResolvedValue({
        id: 'variant-uuid',
        inventory: { quantity: 10, reservedQty: 0 },
      });
      mockPrisma.cart.upsert.mockResolvedValue({ id: 1, userId: 'user-uuid' });
      mockPrisma.cartItem.upsert.mockResolvedValue({});

      const result = await service.addItem('user-uuid', {
        variantId: 'variant-uuid',
        quantity: 2,
      });

      expect(mockPrisma.cart.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'user-uuid' },
          create: { userId: 'user-uuid' },
        }),
      );
      expect(result.message).toBe('Item added to cart successfully');
    });

    it('should increment quantity if variant already exists in cart', async () => {
      mockPrisma.productVariant.findUnique.mockResolvedValue({
        id: 'variant-uuid',
        inventory: { quantity: 10, reservedQty: 0 },
      });
      mockPrisma.cart.upsert.mockResolvedValue({ id: 1, userId: 'user-uuid' });
      mockPrisma.cartItem.upsert.mockResolvedValue({});

      await service.addItem('user-uuid', { variantId: 'variant-uuid', quantity: 3 });

      // Confirm upsert increments instead of overwriting
      expect(mockPrisma.cartItem.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: { quantity: { increment: 3 } },
        }),
      );
    });

    it('should throw NotFoundException if variantId does not exist', async () => {
      mockPrisma.productVariant.findUnique.mockResolvedValue(null);

      await expect(
        service.addItem('user-uuid', { variantId: 'bad-uuid', quantity: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if quantity exceeds available inventory', async () => {
      mockPrisma.productVariant.findUnique.mockResolvedValue({
        id: 'variant-uuid',
        // 5 total - 3 reserved = 2 available
        inventory: { quantity: 5, reservedQty: 3 },
      });

      await expect(
        service.addItem('user-uuid', { variantId: 'variant-uuid', quantity: 5 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateItem', () => {
    it('should update quantity correctly', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 4, cartId: 1, quantity: 2 });
      mockPrisma.cartItem.update.mockResolvedValue({ id: 4, quantity: 5 });

      const result = await service.updateItem('user-uuid', 4, { quantity: 5 });

      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 4 },
        data: { quantity: 5 },
      });
      expect(result.message).toBe('Cart item updated successfully');
    });

    it('should remove item when quantity is set to 0', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 4, cartId: 1, quantity: 2 });
      mockPrisma.cartItem.delete.mockResolvedValue({});

      const result = await service.updateItem('user-uuid', 4, { quantity: 0 });

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 4 } });
      expect(mockPrisma.cartItem.update).not.toHaveBeenCalled();
      expect(result.message).toBe('Cart item removed successfully');
    });

    it('should throw NotFoundException if cart item does not belong to user', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.updateItem('user-uuid', 99, { quantity: 2 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeItem', () => {
    it('should delete item from cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 4, cartId: 1 });
      mockPrisma.cartItem.delete.mockResolvedValue({});

      const result = await service.removeItem('user-uuid', 4);

      expect(mockPrisma.cartItem.delete).toHaveBeenCalledWith({ where: { id: 4 } });
      expect(result.message).toBe('Item removed from cart successfully');
    });

    it('should throw NotFoundException if item does not exist in cart', async () => {
      mockPrisma.cart.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(
        service.removeItem('user-uuid', 99),
      ).rejects.toThrow(NotFoundException);
    });
  });
});