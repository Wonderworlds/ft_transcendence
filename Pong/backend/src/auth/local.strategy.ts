import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LogInUserDto } from 'shared/src/Dtos';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    const validUser: LogInUserDto = {username: username.toLowerCase(), password: password};
    const user = await this.authService.validateUser(validUser);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
