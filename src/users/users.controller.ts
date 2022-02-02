import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Role } from '../roles/role.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { ReqUserDto } from './dto/req.user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getUsers(): Promise<ReqUserDto[]> {
    return this.usersService.getUsers();
  }

  @Get('/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getUserById(@Param('userId') userId: string): Promise<ReqUserDto> {
    return this.usersService.getUserById(userId);
  }

  @Patch('/:userId/username')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async updateUsername(
    @Param('userId') userId: string,
    @Body() updateUsernameDto: UpdateUsernameDto,
  ): Promise<ReqUserDto> {
    return this.usersService.updateUsername(userId, updateUsernameDto);
  }

  @Patch('/:userId/password')
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  async updatePassword(
    @Param('userId') userId: string,
    @Body() updatePassowrdDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    return this.usersService.updatePassword(userId, updatePassowrdDto);
  }

  @Patch('/:userId/roles/userToAdmin')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async userToAdmin(@Param('userId') userId: string): Promise<ReqUserDto> {
    return this.usersService.userToAdmin(userId);
  }

  @Patch('/:userId/roles/adminToUser')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async adminToUser(@Param('userId') userId: string): Promise<ReqUserDto> {
    return this.usersService.adminToUser(userId);
  }

  @Delete('/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async removeUser(
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.usersService.removeUser(userId);
  }
}
