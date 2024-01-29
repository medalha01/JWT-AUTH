import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user object when a valid payload is provided', async () => {
      const payload = { sub: 1 };
      const expectedUser = { id: 1, username: 'testUser' };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);
      const result = await jwtStrategy.validate(payload);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: payload.sub },
      });
      expect(result).toEqual(expectedUser);
    });

    it('should return null when no user is found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const result = await jwtStrategy.validate({ sub: 1 });

      expect(result).toBeNull();
    });
  });

  // Additional tests can be written for other edge cases and failure scenarios
});
