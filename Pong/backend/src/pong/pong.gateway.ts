import { OnModuleInit, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { stringify } from 'querystring';
import { Server, Socket } from 'socket.io';
import { UserDto } from 'src/dtos/User.dto';
import { ValidSocket } from 'src/utils/types';
import { Pong } from './Pong';
import { AGateway } from 'src/websocket/Agateway';

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
  namespace: "/pong",
})
export class PongGateway extends AGateway {

  removeTwoUser() : {p1: ValidSocket, p2: ValidSocket} {
    const users = {p1: this.websocketService.popUser(), p2 : this.websocketService.popUser()};
    return users
  }

   async handleConnection(user: ValidSocket): Promise<void> {
      user.name = user.handshake.query.name as string;
      console.info("pong gateway");
      console.info(`User ${user.name} | Connected to PongGateway | wsID: ${user.id}`);
      if (this.websocketService.getUser(user.name))
      {
          console.info('user already exist');
          user.disconnect();
      }
      else
        this.websocketService.addUser(user);
      if (this.websocketService.getUsersSize() >= 2)
      {
        const users = this.removeTwoUser();
        const game: Pong = new Pong(users.p1, users.p2);        
      }
  }
  
}
