import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server } from 'socket.io';
import { ValidSocket } from 'src/utils/types';

@WebSocketGateway()
export class WebsocketGateway
          implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(protected websocketService: WebsocketService) {}

  afterInit(server: Server) {
    this.websocketService.server = this.server;
  }

  async handleConnection(
          @ConnectedSocket() user:ValidSocket)
  {
    user.name = user.handshake.query.name as string;
    console.info(`User ${user.name} | Connected | wsID: ${user.id}`);
    if (this.websocketService.getUser(user.name))
    {
        console.info('user already exist');
        user.disconnect();
    }
    else
      this.websocketService.addUser(user);
  }

  async handleDisconnect(@ConnectedSocket() user: ValidSocket) {
    console.info(`User ${user.name} | Disconnected`);
    this.websocketService.removeUser(user);
		const users = Object.keys(this.websocketService.users);
		this.websocketService.sendMessage(user, 'user_disconnected', users);
  }

  @SubscribeMessage('handshake')
	async handleHandshake(@ConnectedSocket() user: ValidSocket) {
		console.info(`Handshake received from [${user.name}]`);

		const reconnected = this.websocketService.getUser(user.name);

		if (reconnected) {
			console.info(`User [${user.name}] has reconnected`);
			return;
		}
		this.websocketService.addUser(user);
	}
}
