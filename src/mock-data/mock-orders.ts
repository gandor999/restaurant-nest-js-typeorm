import { CreateOrderDto } from '../orders/dto/create-order.dto';
import { UpdateOrderDto } from '../orders/dto/update-order.dto';
import { Order } from '../orders/entities/order.entity';

const mockOrder: Order = {
  orderId: '123',
  item: 'test',
  quantity: 1,
  customerId: '123',
  isActive: true,
};

const mockOrders: Order[] = [
  {
    orderId: '123',
    item: 'test',
    quantity: 1,
    customerId: '123',
    isActive: true,
  },
  {
    orderId: '123',
    item: 'test',
    quantity: 1,
    customerId: '123',
    isActive: true,
  },
];

const mockCreateOrder: CreateOrderDto = {
  item: 'test',
  quantity: 1,
};

const mockUpdateOrder: UpdateOrderDto = {
  item: 'test',
  quantity: 1,
};

const orderId = '123';

export { mockOrder, mockOrders, mockCreateOrder, mockUpdateOrder, orderId };
