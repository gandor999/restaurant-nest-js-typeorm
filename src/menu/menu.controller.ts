import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/roles/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Menu } from './entities/menu.entity';
import { MenuService } from './menu.service';

@UseGuards(JwtAuthGuard)
@Controller('menuItems')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Get()
  async getMenu(): Promise<Menu[]> {
    return this.menuService.getMenu();
  }

  @Get('/:itemId')
  async getItemById(@Param('itemId') itemId: string): Promise<Menu> {
    return this.menuService.getItemById(itemId);
  }

  @Get('/:item/name')
  async findItemByName(@Param('item') item: string): Promise<Menu> {
    return this.menuService.findItemByName(item);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async createMenu(@Body() createItemDto: CreateItemDto): Promise<Menu> {
    return this.menuService.createMenu(createItemDto);
  }

  @Patch('/:itemId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<Menu> {
    return this.menuService.updateItem(itemId, updateItemDto);
  }

  @Delete('/:itemId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async deleteItem(@Param('itemId') itemId: string): Promise<Menu> {
    return this.menuService.deleteItem(itemId);
  }
}
