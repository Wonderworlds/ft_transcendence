import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidSocket, eventGame } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';

export type UpdateGameDto = {
  ball: Pos;
  pLeft: Pos;
  pRight: Pos;
};
type Pos = {
  x: number;
  y: number;
}

class Ball {
  private position : Pos= {x: 50, y: 50};
  private direction : Pos;
  private readonly speed = 1;

  constructor() {
    this.setDirection(this.getRandomDirection());
  }

  public setDirection(newDir: Pos) {
    this.direction = newDir;
  }

  public getPosition() {
    return this.position;
  }

  private getRandomDirection() {
    //logic pour random
    return { x: 25, y: 25 };
  }

  public onCollision() {}
}

class Player {
  private position : Pos;
  private readonly speed = 2;

  constructor(pos: Pos) { this.setPosition(pos) };

  public getPosition() {
    return this.position;
  }

  private setPosition (newPos: Pos) {
	this.position = newPos;
  }

  public changePos(event: eventGame) {
    console.info(event);
    if (event === eventGame.UP) {
		this.position.y -= this.speed;
    } else {
		this.position.y += this.speed;
    }
  }
}
export class Pong {
  id: string;

  protected server: Server;
  private ball = new Ball();

  p1: Player = new Player({x: 2, y: 50});
  p2: Player = new Player({x: 98, y: 50});
  constructor(
    p1: ValidSocket,
    server: Server,
    protected webservice: WebsocketService,
    id: string,
  ) {
    this.id = id;
    this.server = server;

    this.loop();
  }

  // faire une fonction qui retourne la position du joueur en fonction de son id

  hrtimeMs(): number {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
  }

  getStateOfGame() {
	const stateOfGame: UpdateGameDto = {
		ball: this.ball.getPosition(),
		pLeft: this.p1.getPosition(),
		pRight: this.p2.getPosition(),
	  };
	  return (stateOfGame);
  }

  loop = () => {
    setTimeout(this.loop, 1000 / 24);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());
  };

  private UpdatePaddlePos(paddle: Player, input: eventGame) {}

  public onInput(@ConnectedSocket() client: ValidSocket, input: eventGame) {
	console.log(this.getStateOfGame());
    switch (input) {
      case eventGame.ARROW_UP:
        return this.p2.changePos(eventGame.UP);
      case eventGame.ARROW_DOWN:
        return this.p2.changePos(eventGame.DOWN);
      case eventGame.W_KEY:
        return this.p1.changePos(eventGame.UP);
      case eventGame.S_KEY:
        return this.p1.changePos(eventGame.DOWN);
      default:
        console.info('the fuck');
        return;
    }
  }
}
