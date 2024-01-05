import { ConnectedSocket, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { ValidSocket, eventGame, Player } from "src/utils/types";
import { WebsocketService } from "src/websocket/websocket.service";

export class Pong {
	id: string;
	
	protected server: Server;
	private ball: {posx: number, posy: number};

	p1: Player;
	p2: Player;

	constructor (
		p1: ValidSocket,
		p2: ValidSocket,
		server: Server,
		protected webservice: WebsocketService,
		id: string,
	) {
		this.id = id;
		this.server = server;

		p1.join(this.id);
		p2.join(this.id);

		this.server.to(this.id).emit('ready', {room: id});

		this.webservice.addUser(p1);
		this.webservice.addUser(p2);

		this.p1 = {
			ValidSocket: p1,
			posx: 0,
			posy: 0,
			score: 0,
		};

		this.p2 = {
			ValidSocket: p2,
			posx: 0,
			posy: 0,
			score: 0,
		};

		this.ball = {
			posx: 400,
			posy: 300,
		};

		setInterval(() => {
			this.UpdateBallPos();
		} , 1000 / 60);
	}

	// faire une fonction qui retourne la position du joueur en fonction de son id
	public getPlayerPos(id: string) {
	if (id === this.p1.ValidSocket.id) {
		return this.p1.posy;
	}
	return this.p2.posy;
	}

	private UpdateBallPos() {
		this.ball.posx += 10;
		this.ball.posy += 10;

		if (this.ball.posx > 800 || this.ball.posx < 0) {
			this.ball.posx = 0;
		}

		if (this.ball.posy > 600 || this.ball.posy < 0) {
			this.ball.posy = 0;
		}


		this.server.to(this.id).emit('updateBall', this.ball);
	}

	
	private UpdatePaddlePos(paddle: Player, input: eventGame) {
		switch (input) {
			case eventGame.ARROW_UP:
				paddle.posy -= 10;
				break;
			case eventGame.ARROW_DOWN:
				paddle.posy += 10;
				break;
			default:
				break;
		}
		this.broadcastToPlayerPos();
		paddle.ValidSocket.emit('updatePaddle', paddle.posy);
		this.broadcastToPlayer({client: paddle.ValidSocket.name, msg: paddle.posy});
	}

	public onInput(@ConnectedSocket() client: ValidSocket, input: eventGame)
	{
		this.broadcastToPlayer({client: client.name, msg: input});
		if (client.id === this.p1.ValidSocket.id) {
			this.UpdatePaddlePos(this.p1, input);
		} else {
			this.UpdatePaddlePos(this.p2, input);
		}

		this.UpdateBallPos();
	}

	public broadcastToPlayerPos() {
		const pos = {
			p1: this.p1.posy,
			p2: this.p2.posy,
		};

		this.server.to(this.id).emit('updatePos', pos);
	}

	private broadcastToPlayer(msg: any) {
		this.server.to(this.id).emit('updateGame', msg);
	}
}
