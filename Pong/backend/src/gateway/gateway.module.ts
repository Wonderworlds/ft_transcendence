import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [WebsocketModule, UsersModule],
  providers: [MyGateway]
})
export class GatewayModule {}
