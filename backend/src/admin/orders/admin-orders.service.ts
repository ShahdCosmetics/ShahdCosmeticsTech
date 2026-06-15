import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { OrderStatus } from './dto/update-order-status.dto';

// The transition map IS the business rule, written as data instead of
// if/else branches. Each key is a current status; the array is every
// status it is allowed to move to. Final states map to an empty array.
// Record<OrderStatus, OrderStatus[]> forces us to list all six statuses —
// if someone adds a new status to the DTO later, TypeScript will error
// here until they decide its transitions. That is the safety we want.
const TRANSITION_MAP: Record<OrderStatus, OrderStatus[]> = {
  PAID: ['PROCESSING', 'CANCELLED', 'REFUNDED'],
  PROCESSING: ['SHIPPED', 'CANCELLED', 'REFUNDED'],
  SHIPPED: ['DELIVERED', 'REFUNDED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /admin/orders — every order from every user, newest first.
  // If a status filter is passed, narrow to that status; otherwise return all.
  async getAllOrders(status?: OrderStatus): Promise<object[]> {
    return this.prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        currency: true,
        userId: true,
        createdAt: true,
      },
    });
  }

  // GET /admin/orders/:id — one order with its line items.
  // No userId check: an admin is allowed to see any user's order.
  async getOrderById(id: number): Promise<object> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    return order;
  }

  // PATCH /admin/orders/:id/status — move an order to a new status,
  // but only if the transition map allows it.
  async updateOrderStatus(id: number, newStatus: OrderStatus): Promise<object> {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }

    const allowedNext = TRANSITION_MAP[order.status as OrderStatus];

    // No entry, or an empty array, means there is nowhere valid to go.
    if (!allowedNext || allowedNext.length === 0) {
      throw new BadRequestException(
        `Cannot change status of an order in final state ${order.status}.`,
      );
    }

    if (!allowedNext.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}. ` +
          `Valid next states: ${allowedNext.join(', ')}`,
      );
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: { items: true },
    });
  }
}