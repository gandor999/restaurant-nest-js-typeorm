import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../roles/role.enum';
import {
  mockUser,
  userId,
  mockToken,
  username,
  password,
} from '../mock-data/mock-users';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { User } from 'src/users/entities/user.repository';

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
            getUserById: jest.fn().mockResolvedValue(mockUser),
            getUserByUsername: jest.fn().mockImplementation(async () => {
              return await {
                username: 'user',
                password:
                  '$2b$10$wIKYEglEaJ.1XcSj1Kljb.yBhIzUsMAj0psRDG1H3CUH8mgP7YF/e',
                userId: userId,
                roles: Role.User,
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
    expect(await authService.validateUser('user', 'user')).toEqual(mockUser);
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
