import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { Server } from 'socket.io';
import { ValidSocket } from 'src/utils/types';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway()
export abstract class AGateway
          implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  constructor(protected websocketService: WebsocketService) {}

  afterInit(server: Server) {
    this.websocketService.server = this.server;
  }

  async handleConnection(@ConnectedSocket() user: ValidSocket): Promise<void> {
	user.name = user.handshake.query.name as string;
	if (this.websocketService.getUser(user.name))
	{
		console.info(`user: ${user.name} already exist`);
		user.disconnect();
		return ;
	}
	else
	  this.websocketService.addUser(user);
	console.info(`User ${user.name} | Connected to AGateway | wsID: ${user.id}`);
	console.info(`Users number ${this.websocketService.getUsersSize()}`);
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
