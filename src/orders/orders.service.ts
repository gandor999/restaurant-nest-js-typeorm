import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuService } from '../menu/menu.service';
import { Role } from '../roles/role.enum';
import { ReqUserDto } from '../users/dto/req.user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderRepository)
    private orderRepository: OrderRepository,
    private menuService: MenuService,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    user: ReqUserDto,
  ): Promise<Order> {
    const { item, quantity } = createOrderDto;
    const found = await this.menuService.findItemByName(item);

    const customer: OrderDto = {
      item: found.item,
      quantity: quantity,
      customerId: user.userId,
    };

    const result = await this.orderRepository.create(customer); // Hiding the _id doesn't work for this return
    return await this.orderRepository.save(result);
  }

  async getOrders(user: ReqUserDto): Promise<Order[]> {
    if (user.roles.includes(Role.Admin)) {
      return await this.orderRepository.find({});
    } else {
      return await this.orderRepository.find({ customerId: user.userId });
    }
  }

  async getOrderById(orderId: string, user: ReqUserDto): Promise<Order> {
    const { userId } = user;
    let found;
    if (user.roles.includes(Role.Admin)) {
      found = await this.orderRepository.findOne({ orderId: orderId });
    } else {
      found = await this.orderRepository
        .createQueryBuilder('orders')
        .where('orders.orderId = :orderId AND orders.cusomterId = :userId', {
          orderId,
          userId,
        })
        .getOne(); // just to make sure user gets only the orders they own
    }

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    user: ReqUserDto,
  ): Promise<Order> {
    const { userId } = user;
    let update: {
      orderId: string;
      customerId: string;
      item: string;
      quantity: number;
    };

    if (typeof updateOrderDto.item !== 'undefined') {
      update = {
        orderId,
        customerId: userId,
        item: updateOrderDto.item.toUpperCase(), // to follow with item's unique name
        quantity: updateOrderDto.quantity,
      };
    } else {
      update = {
        orderId,
        customerId: userId,
        item: undefined,
        quantity: updateOrderDto.quantity,
      };
    }

    return await this.orderRepository.save(update);
  }

  async archiveOrder(orderId: string, user: ReqUserDto): Promise<Order> {
    const found = await this.getOrderById(orderId, user);
    found.isActive = !found.isActive;
    return await this.orderRepository.save(found);
  }
}
