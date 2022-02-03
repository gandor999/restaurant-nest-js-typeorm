import { Test, TestingModule } from '@nestjs/testing';
import {
  mockItem,
  itemId,
  mockCreateItem,
  mockUpdateItem,
} from '../mock-data/mock-items';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

describe('MenuController', () => {
  let controller: MenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [
        {
          provide: MenuService,
          useValue: {
            getMenu: jest.fn().mockResolvedValue([mockItem]),
            getItemById: jest.fn().mockResolvedValue(mockItem),
            findItemByName: jest.fn().mockResolvedValue(mockItem),
            createMenu: jest.fn().mockResolvedValue(mockItem),
            updateItem: jest.fn().mockResolvedValue(mockItem),
            deleteItem: jest.fn().mockResolvedValue(mockItem),
          },
        },
      ],
    }).compile();

    controller = module.get<MenuController>(MenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMenu', () => {
    it('should return all items', async () => {
      expect(await controller.getMenu()).toEqual([mockItem]);
    });
  });

  describe('getItemById', () => {
    it('should return items by Id', async () => {
      expect(await controller.getItemById(itemId)).toEqual(mockItem);
    });
  });

  describe('findItemByName', () => {
    it('should return an item by name', async () => {
      expect(await controller.findItemByName(mockItem.item)).toEqual(mockItem);
    });
  });

  describe('createMenu', () => {
    it('should create an item', async () => {
      expect(await controller.createMenu(mockCreateItem)).toEqual(mockItem);
    });
  });

  describe('updateItem', () => {
    it('should update an item', async () => {
      expect(await controller.updateItem(itemId, mockUpdateItem)).toEqual(
        mockItem,
      );
    });
  });

  describe('deleteItem', () => {
    it('should delete an item', async () => {
      expect(await controller.deleteItem(itemId)).toEqual(mockItem);
    });
  });
});
