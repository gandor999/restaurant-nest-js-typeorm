import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockCreateItem,
  mockItem,
  itemId,
  mockUpdateItem,
} from '../mock-data/mock-items';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu.repository';

describe('MenuService', () => {
  let service: MenuService;
  let repository: MenuRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(MenuRepository),
          useValue: {
            create: jest.fn(),
            save: jest.fn().mockResolvedValue(mockItem),
            find: jest.fn().mockResolvedValue([mockItem]),
            findOne: jest.fn().mockResolvedValue(mockItem),
            delete: jest.fn().mockResolvedValue(mockItem),

            // got this one from https://github.com/typeorm/typeorm/issues/1774
            createQueryBuilder: jest.fn(() => ({
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(mockItem),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    repository = module.get<MenuRepository>(MenuRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an item in the menu and return it', async () => {
    expect(await service.createMenu(mockCreateItem)).toEqual(mockItem);
  });

  it('should get all items', async () => {
    expect(await service.getMenu()).toEqual([mockItem]);
  });

  it('should find an item by id', async () => {
    expect(await service.getItemById(itemId)).toEqual(mockItem);
  });

  it('should get item by name', async () => {
    expect(await service.findItemByName(mockItem.item)).toEqual(mockItem);
  });

  it('should update an item', async () => {
    expect(await service.updateItem(itemId, mockUpdateItem)).toEqual(mockItem);
  });

  it('should delete an item', async () => {
    expect(await service.deleteItem(itemId)).toEqual(mockItem);
  });

  describe('error handling', () => {
    it('should return not found error when nothing is found', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValueOnce(null);
      try {
        await service.getItemById(itemId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return not found error when nothing is found', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      } as any); // return type for createQueryBuilder is SelectQueryBuilder<Menu>
      try {
        await service.findItemByName(mockItem.item);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return conflict error when there is already an item in the menu', async () => {
      jest
        .spyOn(repository, 'save')
        .mockRejectedValueOnce(new ConflictException());
      try {
        await service.createMenu(mockCreateItem);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
    });
  });
});
