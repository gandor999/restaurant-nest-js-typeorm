import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../roles/role.enum';
import { User } from '../users/schema/user.schema';
import {
  mockUser,
  userId,
  mockAdmin,
  mockToken,
  username,
  password,
} from '../mock-testing-data/mock-user';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getUserById: jest
              .fn()
              .mockImplementation(async () => (await mockAdmin) as User),
            getUserByUsername: jest.fn().mockImplementation(async () => {
              return await {
                username: 'admin',
                password:
                  '$2b$10$Qkg8c0Q3BUbEgXyjBUdl7.TBW0E/L/n5rDGGcn00.qNU6SVJYwCGC',
                userId: userId,
                roles: Role.Admin,
              };
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockResolvedValue(mockToken),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate the user logging in', async () => {
    expect(await authService.validateUser('admin', 'admin')).toEqual(
      mockAdmin as User,
    );
  });

  it('should login the user and return the access token', async () => {
    expect(await authService.login(mockUser as User)).toEqual({
      access_token: jwtService.sign(mockUser),
    });
  });

  describe('Error handling', () => {
    describe('validateUser()', () => {
      it('should return null when user is not valid', async () => {
        expect(await authService.validateUser(username, password)).toEqual(
          null,
        );
      });
    });
  });
});
