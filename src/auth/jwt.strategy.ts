import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

// Decorate the JwtStrategy class with the Injectable decorator to make it injectable
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Define a constructor that takes in an instance of the PrismaService class
  constructor(private prisma: PrismaService) {
    // Call the super constructor of the PassportStrategy class with the Strategy class as argument
    super({
      // Set the options for the JWT strategy
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'abc161981', // Replace with your secret key
    });
  }

  // Define an asynchronous method called validate that takes in a payload of any type
  async validate(payload: any) {
    // Use the PrismaService to find a unique user based on the payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    // Return the found user
    return user;
  }
}
