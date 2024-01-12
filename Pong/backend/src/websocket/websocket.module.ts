import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
  imports: [JwtModule],
})
export class WebsocketModule {}
