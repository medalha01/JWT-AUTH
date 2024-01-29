/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw an exception if user exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });
      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'password',
          username: 'testuser',
        }),
      ).rejects.toThrow(HttpException);
    });

    it('should create a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
      });
      const result = await authService.register({
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      });
      expect(result).toEqual({
        email: 'test@example.com',
        username: 'testuser',
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toBeNull();
    });

    it('should return user data if password matches', async () => {
      const user = {
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      const result = await authService.validateUser({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual({ email: 'test@example.com' });
    });
  });

  describe('login', () => {
    it('should throw an exception if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(
        authService.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(HttpException);
    });

    it('should return an access token if user exists', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue('token');
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  // Additional tests can be written for other edge cases and failure scenarios
});
