import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { IPaymentService } from '../payment/payment.interface';
import { PAYMENT_SERVICE } from '../payment/payment.interface';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService,
  ) {}

  async createOrder(userId: string): Promise<object> {
    return this.prisma.$transaction(async (tx) => {
      // Fetch cart and all items with variant pricing
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              variant: {
                select: {
                  sku: true,
                  product: { select: { name: true, basePrice: true } },
                },
              },
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      // Snapshot prices at time of order — never reference live price after this
      const orderItems = cart.items.map((item) => ({
        variantId: item.variantId,
        productName: item.variant.product.name,
        sku: item.variant.sku,
        quantity: item.quantity,
        unitPrice: item.variant.product.basePrice,
        totalPrice: item.variant.product.basePrice.mul(item.quantity),
      }));

      // Calculate total from snapshots
      const totalAmount = orderItems.reduce(
        (sum, item) => sum.add(item.totalPrice),
        new Decimal(0),
      );

      // Generate unique order number
      const orderNumber =
        'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();

      // Process payment through abstraction layer
      const paymentResult = await this.paymentService.processPayment(
        totalAmount,
        'TRY',
        { userId, orderNumber },
      );

      if (!paymentResult.success) {
        // Transaction rolls back — cart untouched
        throw new BadRequestException('Payment failed');
      }

      // Create order with PAID status
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: 'PAID',
          totalAmount,
          currency: 'TRY',
          paymentReference: paymentResult.reference,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Clear cart after successful order
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });
  }

  async getOrders(userId: string): Promise<object[]> {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        totalAmount: true,
        currency: true,
        createdAt: true,
      },
    });
  }

  async getOrder(userId: string, orderId: number): Promise<object> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    // Throw 404 for both not found and wrong user — never leak other users' orders
    if (!order || order.userId !== userId) {
      throw new NotFoundException(`Order with id "${orderId}" not found`);
    }

    return order;
  }
}