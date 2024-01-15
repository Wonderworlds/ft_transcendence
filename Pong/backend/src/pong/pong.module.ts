import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [WebsocketModule, UsersModule],
  providers: [PongGateway, PongService, PongController],
  exports: [PongGateway, PongService, PongController],
  controllers: [PongController],
})
export class PongModule {}
