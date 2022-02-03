import { CreateItemDto } from '../menu/dto/create-item.dto';
import { UpdateItemDto } from '../menu/dto/update-item.dto';
import { Menu } from '../menu/entities/menu.entity';

const mockItem: Menu = {
  item: 'test',
  itemId: '123',
  description: 'test',
  type: 'test',
};

const mockItems: Menu[] = [
  {
    item: 'test',
    itemId: '123',
    description: 'test',
    type: 'test',
  },
  { item: 'test', itemId: '234', description: 'test', type: 'test' },
];

const mockCreateItem: CreateItemDto = {
  item: 'test',
  description: 'test',
  type: 'test',
};

const mockUpdateItem: UpdateItemDto = {
  item: 'test',
  description: 'test',
  type: 'test',
};

const itemId = '123';

export { mockItem, mockItems, itemId, mockCreateItem, mockUpdateItem };
