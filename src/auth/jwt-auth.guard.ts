import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const jwt = this.extractJwtToken(request);
      const decoded = this.verifyJwtToken(jwt);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access or invalid token');
    }
  }

  private extractJwtToken(request: any): string {
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Authorization header not found');

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer')
      throw new UnauthorizedException('Invalid token format');

    return parts[1];
  }

  private verifyJwtToken(token: string) {
    try {
      //const secret = this.configService.get<string>('JWT_SECRET');
      const secret = 'abc161981';
      return this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
