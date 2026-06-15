import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AdminOrdersService } from './admin-orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetOrdersQueryDto } from './dto/get-orders-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

// Every route here is admin-only. JwtAuthGuard verifies the token first,
// then RolesGuard checks the role. @Roles('SUPER_ADMIN') sets the bar.
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  // GET /admin/orders  (optionally ?status=PAID)
  // The query DTO validates status before we get here.
  @Get()
  getAllOrders(@Query() query: GetOrdersQueryDto): Promise<object[]> {
    return this.adminOrdersService.getAllOrders(query.status);
  }

  // GET /admin/orders/:id
  // ParseIntPipe turns the URL text "12" into the number 12, matching
  // the Order model's Int id. Non-numeric ids get a 400 automatically.
  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.adminOrdersService.getOrderById(id);
  }

  // PATCH /admin/orders/:id/status
  // UpdateOrderStatusDto validates the body's status field.
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<object> {
    return this.adminOrdersService.updateOrderStatus(id, dto.status);
  }
}