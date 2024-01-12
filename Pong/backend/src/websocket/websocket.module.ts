import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
  imports: [JwtModule, UsersModule],
})
export class WebsocketModule {}
