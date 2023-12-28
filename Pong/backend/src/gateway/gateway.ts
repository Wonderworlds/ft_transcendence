import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Status, UserFront } from "src/dtos/User.dto";
import { WebsocketGateway } from "src/websocket/websocket.gateway";

@WebSocketGateway({
	cors: {
		origin: [process.env.FRONT_URL],
	}
})
export class MyGateway extends WebsocketGateway  {

	@SubscribeMessage('login')
	onLogin(client: any, @MessageBody() body: string) {
		console.log("Event login");
		let user: UserFront = {pseudo: "",
			ppImg: "vite.svg",
			status: Status.Online};
		if (!this.websocketService.getUser(body))
			this.server.to(client.id).emit('onLogin', user);
		else
		{
			user.pseudo = body;
			this.server.to(client.id).emit('onLogin', user);
		}
		
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
}