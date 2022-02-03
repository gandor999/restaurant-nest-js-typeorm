import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Role } from '../roles/role.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockUser,
  userId,
  mockCreateUser,
  username,
  mockUsername,
  mockPassword,
  mockAdmin,
} from '../mock-data/mock-users';
import { User } from './entities/user.repository';
import { UserRepository } from './repositories/user.repository';

describe('UsersService', () => {
  let service: UsersService;
  let model: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: {
            create: jest.fn().mockImplementation(async (mockCreateUser) => {
              return await {
                userId: userId,
                roles: Role.User,
                ...mockCreateUser,
              };
            }),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue({ message: 'user removed' }),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and have their password hashed', async () => {
    jest.mock('bcrypt');
    jest.spyOn(bcrypt, 'genSalt');
    jest.spyOn(bcrypt, 'hash');
    const user = await service.createUser(mockCreateUser);
    expect(user.password).not.toEqual(mockCreateUser.password);
    expect(bcrypt.genSalt).toBeCalled();
    expect(bcrypt.hash).toBeCalled();
  });

  it('should return all users', async () => {
    expect(await service.getUsers()).toEqual([mockUser]);
  });

  it('should return a user by id', async () => {
    expect(await service.getUserById(userId)).toEqual(mockUser);
  });

  it('should return a user by username', async () => {
    expect(await service.getUserByUsername(username)).toEqual(mockUser);
  });

  it('should update a username by id and return the new updated user', async () => {
    expect(await service.updateUsername(userId, mockUsername)).toEqual(
      mockUser,
    );
  });

  it('should update a password by id and return the new updated password', async () => {
    expect(await service.updatePassword(userId, mockPassword)).toEqual({
      message: 'password updated',
    });
  });

  it('should convert a user to admin and return the new admin', async () => {
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as User);
    const newAdmin = await service.userToAdmin(userId);
    expect(newAdmin.roles).toEqual('admin'); // turns out mockUser got converted here as well
  });

  it('should convert a admin to user and return the new user', async () => {
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockAdmin as User);
    const user = await service.adminToUser(userId);
    expect(user.roles).toEqual('user');
  });

  it('should remove a user and return a confirm message of deletion', async () => {
    expect(await service.removeUser(userId)).toEqual({
      message: 'user removed',
    });
  });

  describe('Error Handling', () => {
    it('should return a conflict exception if there is already a username existing in db', async () => {
      jest.spyOn(model, 'save').mockRejectedValueOnce(new ConflictException());
      try {
        await service.createUser(mockCreateUser);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw a not found exception when no user is found by Id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(null);
      try {
        await service.getUserById(userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw a notfound exception when no user is found by username', async () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce(null);

      try {
        await service.getUserByUsername(username);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
