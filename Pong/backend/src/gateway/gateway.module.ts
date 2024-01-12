import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { PongModule } from 'src/pong/pong.module';
import { UsersModule } from 'src/users/users.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { Gateway } from './gateway';

@Module({
  providers: [Gateway],
  imports: [WebsocketModule, UsersModule, ChatModule, PongModule],
})
export class GatewayModule {}
