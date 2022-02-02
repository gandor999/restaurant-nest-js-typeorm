import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUser } from '../mock-testing-data/mock-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockJWTToken = 'nninxe12en1xn';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest
              .fn()
              .mockImplementation(async (mockCreateUser: CreateUserDto) => {
                return await mockJWTToken;
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {
    it('should login user and return accestoken', async () => {
      expect(await controller.login(mockCreateUser)).toEqual(mockJWTToken);
    });
  });
});
