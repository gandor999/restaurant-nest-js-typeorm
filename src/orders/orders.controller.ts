import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getOrders(@Request() req): Promise<Order[]> {
    return this.ordersService.getOrders(req.user);
  }

  @Get('/:orderId')
  async getOrderById(
    @Param('orderId') orderId: string,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.getOrderById(orderId, req.user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.createOrder(createOrderDto, req.user);
  }

  @Patch('/:orderId')
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.updateOrder(orderId, updateOrderDto, req.user);
  }

  @Delete('/:orderId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async archiveOrder(
    @Param('orderId') orderId: string,
    @Request() req,
  ): Promise<Order> {
    return this.ordersService.archiveOrder(orderId, req.user);
  }
}
