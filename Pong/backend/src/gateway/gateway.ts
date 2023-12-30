import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { UsersService } from "src/users/users.service";
import { UserDto } from "src/utils/dtos";
import { ValidSocket } from "src/utils/types";
import { AGateway } from "src/websocket/Agateway";
import { WebsocketService } from "src/websocket/websocket.service";

@WebSocketGateway({
	cors: {
		origin: [process.env.FRONT_URL],
	},
	namespace: "/principal"
})
export class MyGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {

	@WebSocketServer() server: Server;

	constructor(private userService: UsersService, protected websocketService: WebsocketService) {}

	matchQueue: Map<string, ValidSocket> = new Map<string, ValidSocket>();

	afterInit(server: Server) {
		this.websocketService.server = this.server;
	  }

	async handleConnection(@ConnectedSocket() user: ValidSocket): Promise<void> {
		user.name = user.handshake.query.name as string;
		if (this.websocketService.getUser(user.name))
		{
			user.disconnect();
			return ;
		}
		else
		  this.websocketService.addUser(user);
		console.info(`User ${user.name} | Connected to Principal Gateway | wsID: ${user.id}`);
		console.info(`Users number ${this.websocketService.getUsersSize()}`);
	}

	async handleDisconnect(@ConnectedSocket() client: ValidSocket) {
		console.info(`User ${client.name} | Disconnected`);
		if (this.matchQueue.get(client.name))
			this.matchQueue.delete(client.name);
		this.websocketService.removeUser(client);
	  }
	
	@SubscribeMessage('searchMatch')
	onSearchMatch(@ConnectedSocket() client: ValidSocket) {
		console.info(`User ${client.name} | searchMatch`);
		if (this.matchQueue.get(client.name))
			return ;
		if (this.matchQueue.size > 0)
		{
			const iterator = this.matchQueue.values();
			const opponent = iterator.next().value;
			this.matchQueue.delete(opponent.name);
			this.server.to([client.id, opponent.id]).emit('matchFound');
			console.info(`MatchMaking found: ${opponent.name} | ${client.name}`);
		}
		else
			this.matchQueue.set(client.name, client);
	}

	@SubscribeMessage('cancelSearch')
	onCancelSearch(@ConnectedSocket() client: ValidSocket) {
		console.info(`User ${client.name} | cancelSearch`);
		this.matchQueue.delete(client.name);
	}

	@SubscribeMessage('login')
	async onLogin(@ConnectedSocket() client: ValidSocket, @MessageBody() body: UserDto) {
		console.info(`User ${client.name} | onLogin`);
		console.info(body);
		if (!(await this.userService.findUserByUsername(body.username)))
			this.userService.createUserDB(body);
		else
			this.userService.updateUser(client.name, body);
		this.server.to(client.id).emit('onUpdateUser', body);
	}

	@SubscribeMessage('updateUser')
	async onUpdateUser(@ConnectedSocket() client: ValidSocket, @MessageBody() body: UserDto) {
		console.info(client.name);
		console.info(body);
		// await this.userService.updateUser(client.name, body);
		// this.server.to(client.id).emit('onUpdateUser', body);
	}
}