import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Status, UserFront } from "src/dtos/User.dto";

@WebSocketGateway({
	cors: {
		origin: [process.env.FRONT_URL],
	}
})
export class MyGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on('connection', socket => {
			console.log(socket.id);
			console.log("connected");
		})
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