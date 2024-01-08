import { Global, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
  imports: [UsersModule],
})
export class WebsocketModule {}
