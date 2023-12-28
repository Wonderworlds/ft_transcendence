import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  providers: [MyGateway]
})
export class GatewayModule {}
