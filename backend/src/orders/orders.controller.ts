import {
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Place order from authenticated user's cart
  @Post()
  createOrder(@Request() req: { user: { sub: string } }): Promise<object> {
    return this.ordersService.createOrder(req.user.sub);
  }

  // Get all orders for authenticated user — newest first
  @Get()
  getOrders(@Request() req: { user: { sub: string } }): Promise<object[]> {
    return this.ordersService.getOrders(req.user.sub);
  }

  // Get single order detail — throws 404 if not found or belongs to different user
  @Get(':id')
  getOrder(
    @Request() req: { user: { sub: string } },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<object> {
    return this.ordersService.getOrder(req.user.sub, id);
  }
}