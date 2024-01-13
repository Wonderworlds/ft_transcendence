import { Module } from '@nestjs/common';
import { PongModule } from 'src/pong/pong.module';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatService, ChatGateway],
  exports: [ChatGateway],
  imports: [UsersModule, WebsocketModule, PongModule],
})
export class ChatModule {}
