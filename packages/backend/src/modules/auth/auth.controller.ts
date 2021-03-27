import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('currentUser')
  async currentUser(@Request() req: AuthRequest) {
    const { user } = req;
    return user;
  }

  @Post('login')
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
