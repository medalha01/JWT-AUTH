// src/auth/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  // Asynchronously validate the user's email and password
  async validate(email: string, password: string): Promise<any> {
    const userVal: LoginDto = { email, password }; // Assign the email and password to the user DTO
    // Call the authService to validate the user with the provided email and password
    const user = await this.authService.validateUser(userVal);
    // If no user is found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException();
    }
    // Return the validated user
    return user;
  }

  // Asynchronously log in the user
  async login(email: string, password: string) {
    const user: LoginDto = { email, password };
    // Call the authService to log in the user
    return this.authService.login(user);
  }
}
