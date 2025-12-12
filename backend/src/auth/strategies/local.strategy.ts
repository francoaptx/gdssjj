// src/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    this.logger.log(`Local strategy validation for user: ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      this.logger.warn(`Failed login attempt for user: ${username}`);
      throw new UnauthorizedException('Credenciales inválidas');
    }
    this.logger.log(`Successful validation for user: ${username}`);
    return user;
  }
}