import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
	cors: {
		origin: ['http://localhost:8080']
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
}