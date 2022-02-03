import { Role } from '../roles/role.enum';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ReqUserDto } from '../users/dto/req.user.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UpdateUsernameDto } from '../users/dto/update-username.dto';
import { User } from '../users/entities/user.repository';

const mockUser: ReqUserDto = {
  username: 'test',
  userId: '123',
  roles: Role.User,
};

const mockCompleteUser: User = {
  username: 'test',
  password: 'test',
  userId: '123',
  roles: Role.User,
};

const mockAdmin: ReqUserDto = {
  username: 'test',
  userId: '123',
  roles: Role.Admin,
};

const mockUsername: UpdateUsernameDto = {
  username: 'test',
};

const mockPassword: UpdatePasswordDto = {
  password: 'test',
};

const mockCreateUser: CreateUserDto = {
  username: 'test',
  password: 'test',
};

const mockLoginUser: CreateUserDto = {
  username: 'test',
  password: 'test',
};

const username = 'test';

const password = 'test';

const hashedPassword = '12312s1wfecaqwdxqwsd1cxs1';

const salt = 'cavqcq2r3q2r3cq34cf43';

const userId = '123';

const mockToken = 'awur2pu3n';

export {
  mockUser,
  userId,
  mockAdmin,
  mockUsername,
  mockPassword,
  mockCompleteUser,
  username,
  hashedPassword,
  salt,
  mockCreateUser,
  mockLoginUser,
  password,
  mockToken,
};
