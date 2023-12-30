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

	async handleConnection(@ConnectedSocket() user: ValidSocket): Promise<void> {
		user.name = user.handshake.query.name as string;
		console.info("principal gateway");
		console.info(`User ${user.name} | Connected to Principal Gateway | wsID: ${user.id}`);
	}

	@SubscribeMessage('login')
	onLogin(client: Socket, body: string) {
		console.log("Event login");
		let user: UserFront = {pseudo: body,
			ppImg: "vite.svg",
			status: Status.Online};
		this.server.to(client.id).emit('onUpdateUser', user);
	}

	@SubscribeMessage('newMessage')
	onNewMessage(@MessageBody() body: any) {
		console.log(body);
		this.server.emit('onMessage', {
			msg: 'New Message',
			content: body,
		})
	}

	@SubscribeMessage('getUser')
	onGetUser(client: any) {
		console.log("Event getUser");
		const user: UserFront = {pseudo: "fmauguin",
			ppImg: "vite.svg",
			status: Status.Online};
		
		this.server.to(client.id).emit('onGetUser', user);
	}

	@SubscribeMessage('updateUserName')
	onUpdateUser(client: any, @MessageBody() body: string) {
		console.log("Event updateUserName");
		console.log(JSON.stringify(client));
		const user: UserFront = {pseudo: body,
			ppImg: "vite.svg",
			status: Status.Online};
		
		this.server.to(client.id).emit('onUpdateUser', user);
	}
}