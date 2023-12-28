import { Module } from '@nestjs/common';
import { PongController } from './controllers/pong/pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './services/pong.service';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { Server } from 'socket.io';

@Module({
  imports: [WebsocketModule],
  controllers: [PongController],
  providers: [PongGateway, PongService, Server]
})
export class PongModule {}
