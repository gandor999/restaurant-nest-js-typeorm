import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../mock-data/mock-users';
import {
  mockCreateOrder,
  mockOrder,
  mockUpdateOrder,
  orderId,
} from '../mock-data/mock-orders';
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
            getOrders: jest.fn().mockResolvedValue([mockOrder]),
            getOrderById: jest.fn().mockResolvedValue(mockOrder),
            createOrder: jest.fn().mockResolvedValue(mockOrder),
            updateOrder: jest.fn().mockResolvedValue(mockOrder),
            archiveOrder: jest.fn().mockResolvedValue(mockOrder),
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
      expect(await controller.createOrder(mockCreateOrder, mockUser)).toEqual(
        mockOrder,
      );
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
      ).toEqual(mockOrder);
    });
  });

  describe('archiveOrder()', () => {
    it('should archive an order by Id', async () => {
      expect(await controller.archiveOrder(orderId, mockUser)).toEqual(
        mockOrder,
      );
    });
  });
});
