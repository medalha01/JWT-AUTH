import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Determines if the current user is allowed to proceed based on the JWT token's validity.
   *
   * @param {ExecutionContext} context - The execution context providing request and response objects.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Indicates whether the access is granted.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt = this.extractJwtToken(request);

    if (!jwt) {
      throw new UnauthorizedException('JWT token is missing.');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(jwt);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('JWT token is invalid.');
    }
  }

  /**
   * Extracts the JWT token from the request headers.
   *
   * @param request - The incoming HTTP request.
   * @returns {string | null} - The extracted JWT token or null if not present.
   */
  private extractJwtToken(request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

    return parts[1];
  }
}
