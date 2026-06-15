import { Test, TestingModule } from '@nestjs/testing';
import { AdminOrdersService } from './admin-orders.service';
import { PrismaService } from '../../prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('AdminOrdersService', () => {
  let service: AdminOrdersService;

  let mockPrisma: {
    order: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  beforeEach(async () => {
    mockPrisma = {
      order: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AdminOrdersService>(AdminOrdersService);
  });

  describe('getAllOrders', () => {
    it('should return all orders newest first', async () => {
      mockPrisma.order.findMany.mockResolvedValue([
        { id: 2, status: 'PAID', totalAmount: new Decimal('50.00') },
        { id: 1, status: 'SHIPPED', totalAmount: new Decimal('25.00') },
      ]);

      const result = (await service.getAllOrders()) as any[];

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2); // newest first
      // No status filter passed → where should be undefined (return all)
      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: undefined,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('should filter by status when one is provided', async () => {
      mockPrisma.order.findMany.mockResolvedValue([
        { id: 3, status: 'PAID', totalAmount: new Decimal('99.00') },
      ]);

      await service.getAllOrders('PAID');

      expect(mockPrisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PAID' },
        }),
      );
    });
  });

  describe('getOrderById', () => {
    it('should return the order with its items', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 1,
        status: 'PAID',
        items: [{ id: 1, productName: 'Rose Lip Gloss', quantity: 2 }],
      });

      const result = (await service.getOrderById(1)) as any;

      expect(result.id).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it('should throw NotFoundException for a non-existent order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(service.getOrderById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update status when the transition is valid', async () => {
      // PAID → PROCESSING is allowed
      mockPrisma.order.findUnique.mockResolvedValue({ id: 1, status: 'PAID' });
      mockPrisma.order.update.mockResolvedValue({
        id: 1,
        status: 'PROCESSING',
        items: [],
      });

      const result = (await service.updateOrderStatus(1, 'PROCESSING')) as any;

      expect(result.status).toBe('PROCESSING');
      expect(mockPrisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { status: 'PROCESSING' },
        }),
      );
    });

    it('should throw BadRequestException for an invalid transition', async () => {
      // PAID → SHIPPED is NOT allowed
      mockPrisma.order.findUnique.mockResolvedValue({ id: 1, status: 'PAID' });

      await expect(service.updateOrderStatus(1, 'SHIPPED')).rejects.toThrow(
        BadRequestException,
      );
      // Must not attempt the update on a rejected transition
      expect(mockPrisma.order.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when the order is in a final state', async () => {
      // DELIVERED has no allowed next states
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 1,
        status: 'DELIVERED',
      });

      await expect(service.updateOrderStatus(1, 'REFUNDED')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockPrisma.order.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException for a non-existent order', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);

      await expect(service.updateOrderStatus(999, 'PROCESSING')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});