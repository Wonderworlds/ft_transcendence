import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Status, UserFront } from "src/dtos/User.dto";
import { ValidSocket } from "src/utils/types";
import { AGateway } from "src/websocket/Agateway";

@WebSocketGateway({
	cors: {
		origin: [process.env.FRONT_URL],
	},
})
export class MyGateway extends AGateway {

	matchQueue: Map<string, ValidSocket> = new Map<string, ValidSocket>();

	override async handleDisconnect(@ConnectedSocket() client: ValidSocket) {
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

	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onMessage', {
			msg: 'New Message',
			content: body,
		})
	}

	@SubscribeMessage('updateUserName')
	onUpdateUser(@ConnectedSocket() client: ValidSocket) {
		console.log("Event updateUserName");
		this.server.to(client.id).emit('onUpdateUser', client);
	}
}