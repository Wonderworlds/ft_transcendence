import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from 'src/auth/utils';
import { myDebug } from 'src/utils/DEBUG';

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
    myDebug('JwtStrategy', payload);
    return {userId: payload.sub, username: payload.user};
  }
}