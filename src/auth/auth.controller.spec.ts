// Importing necessary modules and dependencies
import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Mocking AuthService for isolation in unit tests
const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;

  // Setting up the test module before each test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  // Testing the 'register' method
  describe('register', () => {
    it('should successfully register a user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        username: 'test',
      };
      mockAuthService.register.mockResolvedValue({ id: 1, ...dto });

      await expect(controller.register(dto)).resolves.toEqual({
        id: 1,
        ...dto,
      });
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });

    // Add more tests for failure scenarios or edge cases
  });

  // Testing the 'login' method
  describe('login', () => {
    it('should successfully log in a user', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      mockAuthService.login.mockResolvedValue({ accessToken: 'token' });

      await expect(controller.login(dto)).resolves.toEqual({
        accessToken: 'token',
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    });

    it('should fail to log in a user', async () => {
      const dto = { email: 'user@example.com', password: 'wrongpassword' };
      const errorResponse = {
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      };
      mockAuthService.login.mockRejectedValue(
        new HttpException(errorResponse, HttpStatus.UNAUTHORIZED),
      );

      await expect(controller.login(dto)).rejects.toThrow(HttpException);
      await expect(controller.login(dto)).rejects.toHaveProperty(
        'message',
        'Unauthorized',
      );
      await expect(controller.login(dto)).rejects.toHaveProperty(
        'status',
        HttpStatus.UNAUTHORIZED,
      );
    });
  });

  // Testing the 'test' method
  describe('test', () => {
    it('should throw a Forbidden exception', async () => {
      await expect(controller.test()).rejects.toThrow(HttpException);
      await expect(controller.test()).rejects.toThrow('Forbidden');
      await expect(controller.test()).rejects.toHaveProperty(
        'status',
        HttpStatus.FORBIDDEN,
      );
    });
  });

  // Additional tests can be added here for other methods or scenarios
});
