import { Body, OnModuleInit, ParseUUIDPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { stringify } from 'querystring';
import { Server, Socket } from 'socket.io';
import { ValidSocket, eventGame } from 'src/utils/types';
import { Pong } from './Pong';
import { AGateway } from 'src/websocket/Agateway';
import { WebsocketService } from 'src/websocket/websocket.service';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway({
	cors: {
		origin: [process.env.FRONT_URL],
	},
	namespace: "/pong"
})
export class PongGateway extends AGateway {

  protected listGame: Map<string, Pong> = new Map<string, Pong>();

  removeTwoUser() : {p1: ValidSocket, p2: ValidSocket} {
    const users = {p1: this.websocketService.popUser(), p2 : this.websocketService.popUser()};
    return users
  }

   override async handleConnection(user: ValidSocket): Promise<void> {
      user.name = user.handshake.query.name as string;
      console.info(`User ${user.name} | Connected to PongGateway | wsID: ${user.id}`);
      if (this.websocketService.getUser(user.name))
      {
          console.info('user already exist');
          //reconnect
      }
      else
        this.websocketService.addUser(user);
      if (this.websocketService.getUsersSize() >= 2)
      {
        const users = this.removeTwoUser();
        const id = uuidv4();
        const game = new Pong(users.p1, users.p2, this.server, new WebsocketService, id);
        this.listGame.set(id, game); 
      }
  }

  @SubscribeMessage('input')
  onInputReceived(@ConnectedSocket() client: ValidSocket, @Body() body: {room: string, event : eventGame})
  {
    this.listGame.get(body.room).onInput(client, body.event);
  }
  
}
