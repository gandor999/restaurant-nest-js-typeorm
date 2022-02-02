import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PayloadDto } from './dto/payload.dto';
import { User } from '../users/entities/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUserByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.usersService.getUserById(user.userId);
    } else {
      return null;
    }
  }

  async login(user: User) {
    const payload: PayloadDto = {
      username: user.username,
      sub: user.userId,
      roles: user.roles,
    }; // sub is a JWT standard that refers to the uesrId of the user
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
