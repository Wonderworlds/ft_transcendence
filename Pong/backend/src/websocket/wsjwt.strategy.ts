import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/auth/utils';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'WebsocketSrategy') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('Authorization'),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }
  
  async validate(payload: any) {
    return {userId: payload.sub, username: payload.user};
  }
}