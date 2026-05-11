import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string): Promise<{
    cartId: number | null;
    totalAmount: string;
    items: {
      itemId: number;
      variantId: string;
      productName: string;
      basePrice: Decimal;
      primaryImage: string | null;
      quantity: number;
      subtotal: string;
    }[];
  }> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  select: {
                    name: true,
                    basePrice: true,
                    images: {
                      where: { isPrimary: true },
                      take: 1,
                      select: { url: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Return an empty cart shape if the user has never added anything yet
    if (!cart) {
      return { cartId: null, totalAmount: '0.00', items: [] };
    }

    const items = cart.items.map((item) => {
      const basePrice = item.variant.product.basePrice;
      const subtotal = basePrice.mul(item.quantity);

      return {
        itemId: item.id,
        variantId: item.variantId,
        productName: item.variant.product.name,
        basePrice,
        primaryImage: item.variant.product.images[0]?.url ?? null,
        quantity: item.quantity,
        subtotal: subtotal.toFixed(2),
      };
    });

    // Pre-calculate total so the frontend never does price arithmetic on the client
    const totalAmount = items
      .reduce((sum, item) => sum + parseFloat(item.subtotal), 0)
      .toFixed(2);

    return { cartId: cart.id, totalAmount, items };
  }

  async addItem(
    userId: string,
    dto: AddToCartDto,
  ): Promise<{ message: string }> {
    // Verify the variant exists and fetch its inventory in one query
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
      include: { inventory: true },
    });

    if (!variant) {
      throw new NotFoundException(
        `Variant with id "${dto.variantId}" not found`,
      );
    }

    const availableStock =
      (variant.inventory?.quantity ?? 0) -
      (variant.inventory?.reservedQty ?? 0);

    if (dto.quantity > availableStock) {
      throw new BadRequestException(
        `Requested quantity exceeds available stock. Available: ${availableStock}`,
      );
    }

    // Find or create the cart — every user gets exactly one cart
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    // Upsert the cart item — increments quantity if variant already exists
    await this.prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: cart.id, variantId: dto.variantId } },
      create: { cartId: cart.id, variantId: dto.variantId, quantity: dto.quantity },
      update: { quantity: { increment: dto.quantity } },
    });

    return { message: 'Item added to cart successfully' };
  }

    async updateItem(
    userId: string,
    itemId: number,
    dto: UpdateCartItemDto,
    ): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
        throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
        where: { id: itemId, cartId: cart.id },
        include: {
        variant: {
            include: { inventory: true },
        },
        },
    });

    if (!cartItem) {
        throw new NotFoundException(`Cart item with id "${itemId}" not found`);
    }

    // quantity 0 is the signal to remove the item entirely
    if (dto.quantity === 0) {
        await this.prisma.cartItem.delete({ where: { id: itemId } });
        return { message: 'Cart item removed successfully' };
    }

    const availableStock =
        (cartItem.variant.inventory?.quantity ?? 0) -
        (cartItem.variant.inventory?.reservedQty ?? 0);

    if (dto.quantity > availableStock) {
        throw new BadRequestException(
        `Requested quantity exceeds available stock. Available: ${availableStock}`,
        );
    }

    await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity: dto.quantity },
    });

    return { message: 'Cart item updated successfully' };
    }
  async removeItem(
    userId: string,
    itemId: number,
  ): Promise<{ message: string }> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with id "${itemId}" not found`);
    }

    await this.prisma.cartItem.delete({ where: { id: itemId } });

    return { message: 'Item removed from cart successfully' };
  }
}