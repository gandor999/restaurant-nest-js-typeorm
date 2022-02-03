import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Menu } from './entities/menu.entity';
import { MenuRepository } from './repositories/menu.repository';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(MenuRepository)
    private menuRepository: MenuRepository,
  ) {}

  async createMenu(createItemDto: CreateItemDto): Promise<Menu> {
    const { item, description, type } = createItemDto;
    const createItem: CreateItemDto = {
      item: item.toUpperCase(), // to make item unique
      description,
      type,
    };
    try {
      const result = this.menuRepository.create(createItem);
      return await this.menuRepository.save(result);
    } catch (err) {
      throw new ConflictException('item already exists');
    }
  }

  async getMenu(): Promise<Menu[]> {
    return await this.menuRepository.find({});
  }

  async getItemById(itemId: string): Promise<Menu> {
    const found = await this.menuRepository.findOne({ itemId: itemId });

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async updateItem(
    itemId: string,
    updateItemDto: UpdateItemDto,
  ): Promise<Menu> {
    return await this.menuRepository.save({
      itemId: itemId,
      ...updateItemDto,
    });
  }

  async deleteItem(itemId: string): Promise<Menu> {
    const found = await this.getItemById(itemId);
    await this.menuRepository.delete({ itemId: itemId });
    return found;
  }

  async findItemByName(item: string): Promise<Menu> {
    const found = await this.menuRepository
      .createQueryBuilder('menu')
      .where('(UPPER(menu.item)) LIKE UPPER(:item)', {
        item: `%${item}%`,
      })
      .getOne(); // this sort of feels faster than regex

    if (!found) {
      throw new NotFoundException();
    }

    return found;
  }
}
