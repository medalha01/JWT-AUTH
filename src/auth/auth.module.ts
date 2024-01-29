// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStrategy } from './local.strategy';

// Import the necessary modules for the AuthModule
@Module({
  imports: [
    // Register the JwtModule with the specified options
    JwtModule.register({
      secret: 'abc161981', // Set the secret key for JWT token
      signOptions: { expiresIn: '600s' }, // Set the expiration time for the JWT token
    }),
  ],
  providers: [AuthService, PrismaService, JwtStrategy, LocalStrategy], // Provide the necessary services for the AuthModule
  controllers: [AuthController], // Specify the controller for the AuthModule
})
export class AuthModule {} // Define the AuthModule class
