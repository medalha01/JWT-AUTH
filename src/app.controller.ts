// src/app.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
// This class defines the AppController, which is responsible for handling routes related to the application.
export class AppController {
  // This decorator specifies that the route handler should only be accessible to requests with a valid JWT token.
  @UseGuards(JwtAuthGuard)
  // This decorator specifies that this route handler listens for GET requests to the 'protected' endpoint.
  @Get('protected')
  // This method defines the behavior for handling requests to the 'protected' endpoint. It takes the request object as a parameter and returns a response object with a message and the user information from the request.
  getProtectedRoute(@Request() req) {
    return {
      message: 'You have accessed a protected route!',
      user: req.user,
    };
  }
}
