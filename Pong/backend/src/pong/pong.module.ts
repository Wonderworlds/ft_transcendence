import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { PongGateway } from './pong.gateway';

@Module({
  imports: [WebsocketModule, UsersModule],
  providers: [PongGateway],
})
export class PongModule {}
