import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UpdateGameDto } from 'src/utils/Dtos';
import { EventGame, Pos, ValidSocket } from 'src/utils/types';

class Ball {
  private position: Pos = { x: 50, y: 50 };
  private direction: Pos;
  private readonly speed = 0.8;

  constructor() {
    this.setDirection(this.getRandomDirection());
  }

  public setDirection(newDir: Pos) {
    this.direction = newDir;
  }

  private dist(a: number, b: number) {
    return Math.abs(b - a);
  }

  public move(p1: Player, p2: Player) {
    //check collision with walls
    if (this.position.x + 2 < 2) {
      this.position = { x: 50, y: 50 };
      this.direction = this.getRandomDirection();
      return p2.addScore();
    } else if (this.position.x > 99) {
      this.position = { x: 50, y: 50 };
      this.direction = this.getRandomDirection();
      return p1.addScore();
    }


	this.checkColision(p1, p2);

    if (this.position.y <= 0) {
      this.direction.y = 1;
    } else if (this.position.y + 2 >= 100) {
      this.direction.y = -1;
    }

	this.setDirection(this.normalize(this.direction));
	this.position.x += this.direction.x * this.speed;
	this.position.y += this.direction.y * this.speed;
  }

  private checkColision(p1: Player, p2: Player) {
    //check collision with players
    const pos1 = p1.getPosition();
    const pos2 = p2.getPosition();
    if (
      this.position.x <= pos1.x + 0.9 &&
      this.dist(this.position.x, pos1.x + 0.9) < 1 &&
      this.position.y >= pos1.y &&
      this.position.y <= pos1.y + 12
    ) {
		this.direction.x = 1;
    } else if (
      this.position.x >= pos2.x - 2 &&
      this.dist(this.position.x, pos2.x - 2) < 1 &&
      this.position.y >= pos2.y &&
      this.position.y <= pos2.y + 12
    ) {
		this.direction.x = -1;
    }
	return false;
  }

  public getPosition() {
    return this.position;
  }

  private getRandomDirection() {
    let x = Math.random() * 2 - 1;
    let y = Math.random() * 2 - 1;
    while (Math.abs(x) < 0.2) {
      x = Math.random() * 2 - 1;
    }
    while (Math.abs(y) < 0.2) {
      y = Math.random() * 2 - 1;
    }
    return { x, y };
  }

  private normalize(dir: Pos): Pos {
    const norme = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    return { x: dir.x / norme, y: dir.y / norme };
  }

  public onCollision() {}
}

class Player {
  private position: Pos;
  private readonly speed = 2;
  private maxY = 88;
  private score = 0;
  public client: ValidSocket;
  public isReady = false;


  constructor(client: ValidSocket, pos: Pos) {
    this.setPosition(pos);
    this.client = client;
  }

  public getPosition() {
    return this.position;
  }

  public getScore() {
    return this.score;
  }

  public addScore() {
    this.score++;
  }

  private setPosition(newPos: Pos) {
    this.position = newPos;
  }

  public changePos(event: EventGame) {
    //console.info(event);
    if (event === EventGame.UP && this.position.y > 0) {
      if (this.position.y - this.speed > 0) {
        this.position.y -= this.speed;
      } else {
        this.position.y = 0;
      }
    } else if (event === EventGame.DOWN && this.position.y < this.maxY) {
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
  private running:boolean = true;
  private scoreEnd = 2;

  p1: Player;
  p2: Player;

  constructor(id: string, server: Server, p1: ValidSocket, p2?: ValidSocket) {
    this.id = id;
    this.server = server;
    this.p1 = new Player(p1, { x: 2, y: 50 });
    this.p2 = new Player(p2, { x: 98, y: 50 });
	this.loop();
  }

  getStateOfGame() {
    const stateOfGame: UpdateGameDto = {
      ball: this.ball.getPosition(),
      pLeft: this.p1.getPosition(),
      pRight: this.p2.getPosition(),
      scorePLeft: this.p1.getScore(),
      scorePRight: this.p2.getScore(),
    };
    return stateOfGame;
  }

  checkScore() {
	  if (this.p1.getScore() < this.scoreEnd && this.p2.getScore() < this.scoreEnd)
		  return 0;
	  else if (this.p1.getScore() === this.scoreEnd) {
		  return 1;
	  } else if (this.p2.getScore() === this.scoreEnd) {
		  return 2;
	  }
  }

  loop = () => {
	if (!this.running)
		return;

    setTimeout(this.loop, 1000 / 48);
    this.ball.move(this.p1, this.p2);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());

	if (this.checkScore()) {
		console.log('game over');
		this.server.to(this.id).emit('gameOver', this.getStateOfGame());
		this.stopLoop();
		return;
	}

  };

  stopLoop() {
	  this.running = false;
  }

  private UpdatePaddlePos(paddle: Player, input: EventGame) {}

  public onInput(@ConnectedSocket() client: ValidSocket, input: string) {
	  //console.log(this.getStateOfGame());
	  if (!client || !this.running)
		  return;
	  if (client.id === this.p1.client.id && client.id === this.p2.client.id) {
		  switch (input) {
			  case 'ARROW_UP':
				  return this.p2.changePos(EventGame.UP);
			  case 'ARROW_DOWN':
				  return this.p2.changePos(EventGame.DOWN);
			  case 'W_KEY':
				  return this.p1.changePos(EventGame.UP);
			  case 'S_KEY':
				  return this.p1.changePos(EventGame.DOWN);
			  default:
				  return console.info('the fuck');
		  }
	  } else {
		  let p = client.id === this.p1.client.id ? this.p1 : this.p2;
		  switch (input) {
			  case 'ARROW_UP':
				  return p.changePos(EventGame.UP);
			  case 'ARROW_DOWN':
				  return p.changePos(EventGame.DOWN);
			  case 'W_KEY':
				  return p.changePos(EventGame.UP);
			  case 'S_KEY':
				  return p.changePos(EventGame.DOWN);
			  default:
				  return console.info('the fuck');
		  }

	  }
  }
}
