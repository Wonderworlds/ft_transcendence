import { Module } from '@nestjs/common';
import { PongGateway } from './pong.gateway';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [PongGateway]
})
export class PongModule {}
