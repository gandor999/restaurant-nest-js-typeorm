import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import {
  mockOrder,
  mockOrders,
  mockCreateOrder,
  mockUpdateOrder,
  orderId,
} from '../mock-testing-data/mock-order';
import { MenuService } from '../menu/menu.service';
import { OrdersService } from './orders.service';
import { Order, OrderDocument } from './schema/order.schema';
import { mockItem } from '../mock-testing-data/mock-item';
import { mockAdmin, mockUser } from '../mock-testing-data/mock-user';
import { OrderDto } from './dto/order.dto';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let orderModel: Model<OrderDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockOrder),
            constructor: jest.fn().mockResolvedValue(mockOrder),
            create: jest.fn().mockImplementation(async (orderDto: OrderDto) => {
              return await {
                isActive: true,
                orderId: '123',
                customerId: '123',
                ...orderDto,
              };
            }),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: MenuService,
          useValue: {
            findItemByName: jest.fn().mockResolvedValue(mockItem),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrdersService>(OrdersService);
    orderModel = module.get<Model<OrderDocument>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  it('should return all orders belonging to user', async () => {
    jest.spyOn(orderModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrders),
    } as any);

    expect(await orderService.getOrders(mockUser)).toEqual(mockOrders);
  });

  it('should return all orders belonging to all users', async () => {
    jest.spyOn(orderModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrders),
    } as any);

    expect(await orderService.getOrders(mockAdmin)).toEqual(mockOrders);
  });

  it('should create a new order', async () => {
    jest.spyOn(orderService, 'getOrderById').mockResolvedValueOnce(mockOrder);
    const newOrder = await orderService.createOrder(mockCreateOrder, mockUser);
    expect(newOrder).toEqual(mockOrder);
  });

  it('should return an order by id (for user)', async () => {
    jest.spyOn(orderModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    } as any);
    const order = await orderService.getOrderById(orderId, mockUser);
    expect(order).toEqual(mockOrder);
  });

  it('should return an order by id (for admin)', async () => {
    jest.spyOn(orderModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    } as any);
    const order = await orderService.getOrderById(orderId, mockAdmin);
    expect(order).toEqual(mockOrder);
  });

  it('should update an order by id and return the new updated order (when item is defined)', async () => {
    jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    } as any);
    jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
    const newOrder = await orderService.updateOrder(
      orderId,
      mockUpdateOrder,
      mockUser,
    );
    expect(newOrder).toEqual(mockOrder);
  });

  it('should update an order by id and return the new updated order (when item is undefined)', async () => {
    jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    } as any);
    jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
    const newOrder = await orderService.updateOrder(
      orderId,
      { item: undefined, quantity: 1 },
      mockUser,
    );
    expect(newOrder).toEqual(mockOrder);
  });

  it('should archive and order by id', async () => {
    jest.spyOn(orderModel, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockOrder),
    } as any);
    jest.spyOn(orderService, 'getOrderById').mockResolvedValue(mockOrder);
    const updatedStatus = await orderService.archiveOrder(orderId, mockUser);
    expect(updatedStatus).toEqual({ isActive: false });
  });

  describe('Error Handling', () => {
    it('should return a not found exception if no order is found', () => {
      jest.spyOn(orderModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);
      expect(orderService.getOrderById(orderId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
