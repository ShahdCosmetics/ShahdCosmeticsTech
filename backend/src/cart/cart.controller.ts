import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart(@Request() req: { user: { sub: string } }) {
    return this.cartService.getCart(req.user.sub);
  }

  @Post('items')
  addItem(
    @Request() req: { user: { sub: string } },
    @Body() dto: AddToCartDto,
  ) {
    return this.cartService.addItem(req.user.sub, dto);
  }

  @Patch('items/:itemId')
  updateItem(
    @Request() req: { user: { sub: string } },
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.sub, itemId, dto);
  }

  @Delete('items/:itemId')
  removeItem(
    @Request() req: { user: { sub: string } },
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(req.user.sub, itemId);
  }
}