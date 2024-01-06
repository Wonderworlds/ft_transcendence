import { ConnectedSocket } from '@nestjs/websockets';
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
  private readonly speed = 0.5 ;

  constructor() {
    this.setDirection(this.getRandomDirection());
  }

  public setDirection(newDir: Pos) {
    this.direction = newDir;
  }

  public move(p1: Player, p2: Player) {
	  //check collision with players
	  if (this.position.x <= p1.getPosition().x && 
		  this.position.y >= p1.getPosition().y &&
		  this.position.y <= p1.getPosition().y + 12
		 ) {
			this.direction.x = 1;
	  } 

	  else if (this.position.x >= p2.getPosition().x - 2 &&
		  this.position.y >= p2.getPosition().y &&
		  this.position.y <= p2.getPosition().y + 12
		  ) {
			this.direction.x = -1;
		}

	  //check collision with walls 
	  if (this.position.x + 2 < 0) {
		this.position = {x: 50, y: 50};
		this.direction = this.getRandomDirection();
		p2.addScore();
	  } else if (this.position.x > 100) {
		this.position = {x: 50, y: 50};
		this.direction = this.getRandomDirection();
		p1.addScore();
	  }

	  if (this.position.y <= 0) {
		this.direction.y = 1;
	  } else if (this.position.y + 2 >= 100) {
		this.direction.y = -1;
	  }
    this.setDirection(this.normalize(this.direction));
	  this.position.x += this.direction.x * this.speed;
	  this.position.y += this.direction.y * this.speed;

  }

  public getPosition() {
    return this.position;
  }

  private getRandomDirection() {
	const x = Math.random() < 0.5 ? -1 : 1;
	const y = Math.random() < 0.5 ? -1 : 1;
	return {x, y};
  }

  private normalize(dir: Pos) : Pos {
    const norme = Math.sqrt((dir.x * dir.x) + (dir.y * dir.y));
    return ({x: dir.x / norme, y: dir.y / norme});
  }

  public onCollision() {}
}

class Player {
  private position : Pos;
  private readonly speed = 5;
  private maxY = 88;
  private score = 0;

  constructor(pos: Pos) { this.setPosition(pos) };

  public getPosition() {
    return this.position;
  }

  public getScore() {
	  return this.score;
  }

  public addScore() {
	  this.score++;
  }

  private setPosition (newPos: Pos) {
	this.position = newPos;
  }

  public changePos(event: eventGame) {
    //console.info(event);
    if (event === eventGame.UP && this.position.y > 0) {
		if (this.position.y - this.speed > 0) {
			this.position.y -= this.speed;
		} else {
		    this.position.y = 0;
		}
    } else if (event === eventGame.DOWN && this.position.y < this.maxY) {
		if (this.position.y + this.speed < this.maxY) {
		    this.position.y += this.speed;
		} else {
			this.position.y = this.maxY;
		}
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
    setTimeout(this.loop, 1000 / 48);
	this.ball.move(this.p1, this.p2);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());
  };

  private UpdatePaddlePos(paddle: Player, input: eventGame) {}

  public onInput(@ConnectedSocket() client: ValidSocket, input: eventGame) {
	//console.log(this.getStateOfGame());
    switch (input) {
      case eventGame.ARROW_UP:
        this.p2.changePos(eventGame.UP);
		break;
      case eventGame.ARROW_DOWN:
        this.p2.changePos(eventGame.DOWN);
		break;
      case eventGame.W_KEY:
        this.p1.changePos(eventGame.UP);
		break;
      case eventGame.S_KEY:
        this.p1.changePos(eventGame.DOWN);
		break;
      default:
        console.info('the fuck');
		break;
    }
  }
}
