import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    this.logger.log(`Validating user: ${username}`);
    
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      return null;
    }
    
    this.logger.log(`User found: ${username}, comparing passwords`);
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    this.logger.log(`Password validation result for ${username}: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    this.logger.log(`Generating JWT token for user: ${user.username}`);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }
}