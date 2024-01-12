import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [WebsocketModule, UsersModule],
  providers: [PongGateway, PongService],
  exports: [PongGateway],
})
export class PongModule {}
