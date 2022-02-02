import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../mock-testing-data/mock-user';
import {
  mockOrder,
  mockCreateOrder,
  mockUpdateOrder,
  orderId,
} from '../mock-testing-data/mock-order';
import { ReqUserDto } from '../users/dto/req.user.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            getOrders: jest
              .fn()
              .mockImplementation(
                async (mockUser: ReqUserDto) => await [mockOrder],
              ),
            createOrder: jest
              .fn()
              .mockImplementation(
                async (
                  mockCreateOrder: CreateOrderDto,
                  mockUser: ReqUserDto,
                ) => {
                  return await {
                    isActive: true,
                    customerId: '123',
                    orderId: '123',
                    ...mockCreateOrder,
                  };
                },
              ),
            getOrderById: jest
              .fn()
              .mockImplementation(
                async (orderId: string, mockUser: ReqUserDto) => {
                  return await mockOrder;
                },
              ),
            updateOrder: jest
              .fn()
              .mockImplementation(
                async (
                  orderId: string,
                  mockUpdateOrder: UpdateOrderDto,
                  mockUser: ReqUserDto,
                ) => {
                  return await {
                    orderId: orderId,
                    isActive: true,
                    customerId: '123',
                    ...mockUpdateOrder,
                  };
                },
              ),
            archiveOrder: jest
              .fn()
              .mockImplementation(
                async (orderId: string, mockUser: ReqUserDto) => {
                  return await { isActive: false };
                },
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders()', () => {
    it('should return an array of orders', async () => {
      expect(await controller.getOrders(mockUser)).toEqual([mockOrder]);
    });
  });

  describe('createOrder()', () => {
    it('should create a new order', async () => {
      expect(await controller.createOrder(mockCreateOrder, mockUser)).toEqual({
        isActive: true,
        customerId: '123',
        orderId: '123',
        ...mockCreateOrder,
      });
    });
  });

  describe('getOrderById()', () => {
    it('should get an order by Id', async () => {
      expect(await controller.getOrderById(orderId, mockUser)).toEqual(
        mockOrder,
      );
    });
  });

  describe('updateOrder()', () => {
    it('should update an order by Id', async () => {
      expect(
        await controller.updateOrder(orderId, mockUpdateOrder, mockUser),
      ).toEqual({
        orderId: orderId,
        isActive: true,
        customerId: '123',
        ...mockUpdateOrder,
      });
    });
  });

  describe('archiveOrder()', () => {
    it('should archive an order by Id', async () => {
      expect(await controller.archiveOrder(orderId, mockUser)).toEqual({
        isActive: false,
      });
    });
  });
});
