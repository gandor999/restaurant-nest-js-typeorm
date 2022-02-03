import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUser, mockUser } from '../mock-data/mock-users';
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
            createUser: jest.fn().mockResolvedValue(mockUser),
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
