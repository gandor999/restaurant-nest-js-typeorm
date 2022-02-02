import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/role.enum';
import { ReqUserDto } from './dto/req.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // User access
    const { username, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      username: username,
      password: hashedPassword,
    };

    try {
      const result = await this.userRepository.create(user);
      const { password, ...createdUser } = await this.userRepository.save(
        result,
      ); // don't show password
      return createdUser as User;
    } catch (err) {
      throw new ConflictException('username already exists');
    }
  }

  async getUsers(): Promise<User[]> {
    // Admin access
    return await this.userRepository.find({});
  }

  async getUserById(userId: string): Promise<User> {
    const found = await this.userRepository.findOne({ userId: userId });

    if (!found) {
      throw new NotFoundException('no such user');
    }

    return found;
  }

  async getUserByUsername(username: string): Promise<User> {
    const found = await this.userRepository.findOne({ username: username });

    if (!found) {
      throw new NotFoundException('No such user');
    }

    return found;
  }

  async updateUsername(
    // Can only be admin acces
    userId: string,
    updateUsernameDto: UpdateUsernameDto,
  ): Promise<ReqUserDto> {
    await this.getUserById(userId); // check
    const update: {
      userId: string;
      username: string;
    } = {
      userId: userId,
      ...updateUsernameDto,
    };
    return await this.userRepository.save(update);
  }

  async updatePassword(
    // Can only be user acces
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const { password } = updatePasswordDto;

    await this.getUserById(userId); // check

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const update: {
      userId: string;
      password: string;
    } = {
      userId,
      password: hashedPassword,
    };

    await this.userRepository.save(update);

    return { message: 'password updated' };
  }

  async userToAdmin(userId: string): Promise<ReqUserDto> {
    const found = await this.getUserById(userId);
    found.roles = Role.Admin;
    await this.userRepository.save(found);
    return found;
  }

  async adminToUser(userId: string): Promise<ReqUserDto> {
    const found = await this.getUserById(userId);
    found.roles = Role.User;
    await this.userRepository.save(found);
    return found;
  }

  async removeUser(userId: string): Promise<{ message: string }> {
    await this.getUserById(userId); // check
    await this.userRepository.delete({ userId: userId });

    return { message: 'user removed' };
  }
}
