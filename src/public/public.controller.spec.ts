import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUser, mockUser } from '../mock-testing-data/mock-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { PublicController } from './public.controller';

describe('PublicController', () => {
  let controller: PublicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublicController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest
              .fn()
              .mockImplementation(
                async (mockCreateUser: CreateUserDto) => await mockUser,
              ),
            getUserById: jest
              .fn()
              .mockImplementation(async (userId) => await mockUser),
          },
        },
      ],
    }).compile();

    controller = module.get<PublicController>(PublicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser()', () => {
    it('should create a new user', async () => {
      expect(await controller.createUser(mockCreateUser)).toEqual(mockUser);
    });
  });
});
