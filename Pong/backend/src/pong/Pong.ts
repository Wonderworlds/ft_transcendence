import { ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { ValidSocket, eventGame } from "src/utils/types";
import { WebsocketService } from "src/websocket/websocket.service";

export class Pong {
	id: string;
	
	protected server: Server;

	p1: ValidSocket;
	p2: ValidSocket;

	constructor (
		p1: ValidSocket,
		p2: ValidSocket,
		server: Server,
		protected webservice: WebsocketService,
		id: string,
	) {
		this.id = id;
		console.log(p1.name, p2.name);
		this.server = server;
		p1.join(this.id);
		p2.join(this.id);
		this.server.to(this.id).emit('ready', {room: id});
		this.webservice.addUser(p1);
		this.webservice.addUser(p2);
	}

	public onInput(@ConnectedSocket() client: ValidSocket, input: eventGame)
	{
		console.info(`${client.name} | ${input}`);
		this.broadcastToPlayer({msg: input});
	}

	private broadcastToPlayer(msg: any) {
		this.server.to(this.id).emit('updateGame', msg);
	}
}