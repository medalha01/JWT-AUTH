// src/auth/auth.module.ts

// First, organize imports by grouping external and internal imports
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Internal imports
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    // Dynamically import JwtModule with configuration from the ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' }, // Token expiration time
      }),
    }),
  ],
  providers: [
    // Only include services and strategies that need to be injected
    AuthService,
    PrismaService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule], // Export JwtModule if it's going to be used elsewhere
})
export class AuthModule {}
