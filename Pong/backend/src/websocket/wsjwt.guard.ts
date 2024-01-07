import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/utils';

@Injectable()
export class WsJwtGuard  implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async validateJWT(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      );
      return payload;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getClient<Socket>().handshake;
    const token = request.query['Authorization'] as string;
    if (!token) {
      throw new UnauthorizedException();
    }
    request['user'] = await this.validateJWT(token);
    return true;
  }
}
