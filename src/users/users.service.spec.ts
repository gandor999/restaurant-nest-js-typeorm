import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import {
  mockAdmin,
  mockUser,
  mockUsername,
  mockPassword,
  userId,
  username,
  mockCreateUser,
} from '../mock-testing-data/mock-user';
import { Role } from '../roles/role.enum';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser),
            constructor: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockImplementation(async (mockCreateUser) => {
              console.log(mockCreateUser.password);
              return await {
                userId: userId,
                roles: Role.User,
                ...mockCreateUser,
              };
            }),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user and have their password hashed', async () => {
    jest.spyOn(model, 'create');
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as User);
    jest.mock('bcrypt');
    jest.spyOn(bcrypt, 'genSalt');
    jest.spyOn(bcrypt, 'hash');
    const user = await service.createUser(mockCreateUser);
    expect(user.password).not.toEqual(mockCreateUser.password);
    expect(bcrypt.genSalt).toBeCalled();
    expect(bcrypt.hash).toBeCalled();
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce([mockUser]),
    } as any);
    const user = await service.getUsers();
    expect(user).toEqual([mockUser]);
  });

  it('should return a user by id', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    const user = await service.getUserById(userId);
    expect(user).toEqual(mockUser);
  });

  it('should return a user by username', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    const user = await service.getUserByUsername(username);
    expect(user).toEqual(mockUser);
  });

  it('should update a username by id and return the new updated user', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as User);
    const newUser = await service.updateUsername(userId, mockUsername);
    expect(newUser).toEqual(mockUser);
  });

  it('should update a password by id and return the new updated password', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    const message = await service.updatePassword(userId, mockPassword);
    expect(message).toEqual({ message: 'password updated' });
  });

  it('should convert a user to admin and return the new admin', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAdmin),
    } as any);
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as User);
    const newAdmin = await service.userToAdmin(userId);
    expect(newAdmin.roles).toEqual(mockUser.roles); // turns out mockUser got converted here as well
  });

  it('should convert a admin to user and return the new user', async () => {
    jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as User);
    const user = await service.adminToUser(userId);
    expect(user.roles).toEqual(mockUser.roles);
  });

  it('should remove a user and return a confirm message of deletion', async () => {
    jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockUser),
    } as any);
    const message = await service.removeUser(userId);
    expect(message).toEqual({ message: 'user removed' });
  });

  describe('Error Handling', () => {
    it('should return a conflict exception if there is already a username existing in db', async () => {
      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(async () => await new ConflictException());
      try {
        await service.createUser(mockCreateUser);
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
    });

    it('should throw a notfound exception when no user is found by Id', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(service.getUserById(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw a notfound exception when no user is found by username', () => {
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(service.getUserByUsername(mockUser.username)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a notfound exception when no user is found by removing a user', () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      expect(service.removeUser(userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw a notfound exception when no user is found by updatig the password', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      try {
        await service.updatePassword(userId, mockPassword);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
