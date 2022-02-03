import { Test, TestingModule } from '@nestjs/testing';

import { MenuService } from '../menu/menu.service';
import { OrdersService } from './orders.service';
import { NotFoundException } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockCreateOrder,
  mockOrder,
  mockUpdateOrder,
  orderId,
} from '../mock-data/mock-orders';
import { mockItem } from '../mock-data/mock-items';
import { mockAdmin, mockUser } from '../mock-data/mock-users';

describe('OrdersService', () => {
  let service: OrdersService;
  let model: OrderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(OrderRepository),
          useValue: {
            create: jest.fn(),
            find: jest.fn().mockResolvedValue([mockOrder]),
            findOne: jest.fn().mockResolvedValue(mockOrder),
            save: jest.fn().mockResolvedValue(mockOrder),

            createQueryBuilder: jest.fn().mockImplementation(() => ({
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockOrder),
            })),
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

    service = module.get<OrdersService>(OrdersService);
    model = module.get<OrderRepository>(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all orders belonging to user', async () => {
    expect(await service.getOrders(mockUser)).toEqual([mockOrder]);
  });

  it('should return all orders belonging to all users', async () => {
    expect(await service.getOrders(mockAdmin)).toEqual([mockOrder]);
  });

  it('should create a new order', async () => {
    expect(await service.createOrder(mockCreateOrder, mockUser)).toEqual(
      mockOrder,
    );
  });

  it('should return an order by id (for user)', async () => {
    expect(await service.getOrderById(orderId, mockUser)).toEqual(mockOrder);
  });

  it('should return an order by id (for admin)', async () => {
    expect(await service.getOrderById(orderId, mockAdmin)).toEqual(mockOrder);
  });

  it('should update an order by id and return the new updated order (when item is defined)', async () => {
    expect(
      await service.updateOrder(orderId, mockUpdateOrder, mockUser),
    ).toEqual(mockOrder);
  });

  it('should update an order by id and return the new updated order (when item is undefined)', async () => {
    expect(
      await service.updateOrder(
        orderId,
        { item: undefined, quantity: 1 },
        mockUser,
      ),
    ).toEqual(mockOrder);
  });

  it('should archive and order by id', async () => {
    expect(await service.archiveOrder(orderId, mockUser)).toEqual(mockOrder);
  });

  describe('Error Handling', () => {
    it('should return a not found exception if no order is found for admin', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(null);
      try {
        await service.getOrderById(orderId, mockUser);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return a not found exception if no order is found for user', async () => {
      jest.spyOn(model, 'createQueryBuilder').mockImplementation(
        () =>
          ({
            where: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValue(null),
          } as any),
      );
      try {
        await service.getOrderById(orderId, mockUser);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
