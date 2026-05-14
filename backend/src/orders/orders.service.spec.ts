import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PAYMENT_SERVICE } from '../payment/payment.interface';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrdersService', () => {
  let service: OrdersService;

  let mockPrisma: {
    cart: { findUnique: jest.Mock };
    order: { findMany: jest.Mock; findUnique: jest.Mock };
    cartItem: { deleteMany: jest.Mock };
    $transaction: jest.Mock;
  };

  let mockPaymentService: {
    processPayment: jest.Mock;
  };

  let mockTx: {
    cart: { findUnique: jest.Mock };
    order: { create: jest.Mock };
    cartItem: { deleteMany: jest.Mock };
  };

  beforeEach(async () => {
    mockTx = {
      cart: { findUnique: jest.fn() },
      order: { create: jest.fn() },
      cartItem: { deleteMany: jest.fn() },
    };

    mockPrisma = {
      cart: { findUnique: jest.fn() },
      order: { findMany: jest.fn(), findUnique: jest.fn() },
      cartItem: { deleteMany: jest.fn() },
      $transaction: jest.fn((cb) => cb(mockTx)),
    };

    mockPaymentService = {
      processPayment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PAYMENT_SERVICE, useValue: mockPaymentService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  // Helper — builds a mock cart with one item
  const buildMockCart = () => ({
    id: 1,
    userId: 'user-uuid',
    items: [
      {
        id: 1,
        variantId: 'variant-uuid',
        quantity: 2,
        variant: {
          sku: 'RLG-001',
          product: {
            name: 'Rose Lip Gloss',
            basePrice: new Decimal('25.00'),
          },
        },
      },
    ],
  });

  describe('createOrder', () => {
    it('should throw BadRequestException if cart is empty', async () => {
      mockTx.cart.findUnique.mockResolvedValue({ id: 1, items: [] });

      await expect(service.createOrder('user-uuid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if cart does not exist', async () => {
      mockTx.cart.findUnique.mockResolvedValue(null);

      await expect(service.createOrder('user-uuid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should snapshot price correctly at time of order', async () => {
      mockTx.cart.findUnique.mockResolvedValue(buildMockCart());
      mockPaymentService.processPayment.mockResolvedValue({
        success: true,
        reference: 'MOCK-ABC123',
      });
      mockTx.order.create.mockResolvedValue({
        id: 1,
        status: 'PAID',
        items: [{ unitPrice: new Decimal('25.00'), totalPrice: new Decimal('50.00') }],
      });
      mockTx.cartItem.deleteMany.mockResolvedValue({});

      await service.createOrder('user-uuid');

      // Confirm order was created with snapshotted prices
      expect(mockTx.order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            totalAmount: new Decimal('50.00'),
            status: 'PAID',
          }),
        }),
      );
    });

    it('should create order with status PAID on successful payment', async () => {
      mockTx.cart.findUnique.mockResolvedValue(buildMockCart());
      mockPaymentService.processPayment.mockResolvedValue({
        success: true,
        reference: 'MOCK-ABC123',
      });
      mockTx.order.create.mockResolvedValue({ id: 1, status: 'PAID', items: [] });
      mockTx.cartItem.deleteMany.mockResolvedValue({});

      const result = await service.createOrder('user-uuid') as any;

      expect(result.status).toBe('PAID');
    });

    it('should clear cart after successful order', async () => {
      mockTx.cart.findUnique.mockResolvedValue(buildMockCart());
      mockPaymentService.processPayment.mockResolvedValue({
        success: true,
        reference: 'MOCK-ABC123',
      });
      mockTx.order.create.mockResolvedValue({ id: 1, status: 'PAID', items: [] });
      mockTx.cartItem.deleteMany.mockResolvedValue({});

      await service.createOrder('user-uuid');

      expect(mockTx.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 1 },
      });
    });

    it('should throw BadRequestException if payment fails', async () => {
      mockTx.cart.findUnique.mockResolvedValue(buildMockCart());
      mockPaymentService.processPayment.mockResolvedValue({
        success: false,
        reference: '',
      });

      await expect(service.createOrder('user-uuid')).rejects.toThrow(
        BadRequestException,
      );

      // Cart must not be cleared on payment failure
      expect(mockTx.cartItem.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('getOrders', () => {
    it('should return all orders for the user newest first', async () => {
      mockPrisma.order.findMany.mockResolvedValue([
        { id: 2, orderNumber: 'ORD-XYZ', status: 'PAID', totalAmount: new Decimal('50.00') },
        { id: 1, orderNumber: 'ORD-ABC', status: 'PAID', totalAmount: new Decimal('25.00') },
      ]);

      const result = await service.getOrders('user-uuid') as any[];

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // newest first
    });
  });

  describe('getOrder', () => {
    it('should throw NotFoundException if order does not exist', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(service.getOrder('user-uuid', 999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if order belongs to different user', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 1,
        userId: 'other-user-uuid', // different user
        items: [],
      });

      await expect(service.getOrder('user-uuid', 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return order if it belongs to the user', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 1,
        userId: 'user-uuid',
        status: 'PAID',
        items: [],
      });

      const result = await service.getOrder('user-uuid', 1) as any;

      expect(result.id).toBe(1);
      expect(result.status).toBe('PAID');
    });
  });
});