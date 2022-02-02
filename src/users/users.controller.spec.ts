import { Test, TestingModule } from '@nestjs/testing';
import {
  mockAdmin,
  mockUser,
  mockUsername,
  mockPassword,
  userId,
} from '../mock-testing-data/mock-user';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn().mockResolvedValue([mockUser]),
            getUserById: jest
              .fn()
              .mockImplementation(async (userId: string) => {
                return await mockUser;
              }),
            updateUsername: jest
              .fn()
              .mockImplementation(
                async (
                  userId: string,
                  mockUpdateUsername: UpdateUsernameDto,
                ) => {
                  return await mockUser;
                },
              ),
            updatePassword: jest
              .fn()
              .mockImplementation(
                async (
                  userId: string,
                  mockUpdateUsername: UpdateUsernameDto,
                ) => {
                  return await { message: 'password updated' };
                },
              ),

            userToAdmin: jest
              .fn()
              .mockImplementation(async (userId: string) => {
                return await mockAdmin;
              }),

            adminToUser: jest
              .fn()
              .mockImplementation(async (userId: string) => {
                return await mockUser;
              }),

            removeUser: jest.fn().mockImplementation(async (userId: string) => {
              return await { message: 'user removed' };
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers()', () => {
    it('should return an array of users', async () => {
      expect(await controller.getUsers()).toEqual([mockUser]);
    });
  });

  describe('getUserById()', () => {
    it('should get a user by Id', async () => {
      expect(await controller.getUserById(userId)).toEqual(mockUser);
    });
  });

  describe('updateUsername()', () => {
    it('should update a username by Id', async () => {
      expect(await controller.updateUsername(userId, mockUsername)).toEqual(
        mockUser,
      );
    });
  });

  describe('updatePassword()', () => {
    it('should update a password by Id', async () => {
      expect(await controller.updatePassword(userId, mockPassword)).toEqual({
        message: 'password updated',
      });
    });
  });

  describe('userToAdmin()', () => {
    it('should update a user to admin by Id', async () => {
      expect(await controller.userToAdmin(userId)).toEqual(mockAdmin);
    });
  });

  describe('adminToUser()', () => {
    it('should update a admin to user by Id', async () => {
      expect(await controller.adminToUser(userId)).toEqual(mockUser);
    });
  });

  describe('removeUser()', () => {
    it('should remove a user by Id', async () => {
      expect(await controller.removeUser(userId)).toEqual({
        message: 'user removed',
      });
    });
  });
});
