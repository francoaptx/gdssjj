import { Controller, Post, Req, UseGuards, Logger } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    this.logger.log(`Login request for user: ${req.user?.['username']}`);
    const result = this.authService.login(req.user);
    this.logger.log(`Login response: ${JSON.stringify(result)}`);
    return result;
  }
}