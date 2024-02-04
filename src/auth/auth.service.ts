/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable, Logger, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, username } = registerDto;

    this.logger.warn(`Registering user ${registerDto.email}`);

    const userExists = await this.getUser(email);
    if (userExists) {
      throw new HttpException('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto; // Add more tests for failure scenarios or edge cases

    const user = await this.getUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async login(loginDto: LoginDto) {
    this.logger.debug(`Logging in user ${loginDto}`);

    const user = await this.getUser(loginDto.email);
    if (!user) {
      this.logger.warn(
        `Login failed: User not found for email ${loginDto.email}`,
      );
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    this.logger.debug(`User ${user.email} authenticated successfully`);

    return { access_token: token };
  }

  private async getUser(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }
    return this.prisma.user.findUnique({ where: { email } });
  }
}
