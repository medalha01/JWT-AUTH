// Import the necessary decorators and modules from the NestJS framework
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto, LoginDto } from '../dto/auth.dto';

// Define a controller with the base route path 'auth'
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name);

  // Inject the authService dependency using dependency injection
  constructor(private readonly authService: AuthService) {}

  // Define an endpoint to register a new user
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    // Call the register method of the authService
    // and pass the registerDto
    this.logger.warn(`Registering user ${registerDto.email}`);
    return this.authService.register(registerDto);
  }

  // Use the LocalAuthGuard to authenticate the user and define an endpoint to log in a user
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    this.logger.warn(`Logging in user ${loginDto.email}`);
    return this.authService.login(loginDto);
  }

  // Define a test endpoint that throws a Forbidden error
  @Post('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async test() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
