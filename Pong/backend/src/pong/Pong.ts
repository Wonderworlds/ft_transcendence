import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UpdateGameDto } from 'src/utils/Dtos';
import { Pos, ValidSocket, eventGame } from 'src/utils/types';

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

  p1: Player;
  p2: Player;
  constructor(id: string, server: Server, p1: ValidSocket, p2?: ValidSocket) {
    this.id = id;
    this.server = server;
    this.p1 = new Player(p1, { x: 2, y: 50 });
    this.p2 = new Player(p2 ? p2 : p1, { x: 2, y: 50 });
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

  loop = () => {
    setTimeout(this.loop, 1000 / 60);
    this.ball.move(this.p1, this.p2);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());
  };

  private UpdatePaddlePos(paddle: Player, input: eventGame) {}

  public onInput(@ConnectedSocket() client: ValidSocket, input: eventGame) {
    //console.log(this.getStateOfGame());
    switch (input) {
      case eventGame.ARROW_UP:
        this.p2.changePos(eventGame.UP);
        return;
      case eventGame.ARROW_DOWN:
        this.p2.changePos(eventGame.DOWN);
        return;
      case eventGame.W_KEY:
        this.p1.changePos(eventGame.UP);
        return;
      case eventGame.S_KEY:
        this.p1.changePos(eventGame.DOWN);
        return;
      case eventGame.READY:
        if (client.name === this.p1.client.name) this.p1.isReady = true;
        else if (client.name === this.p2.client.name) this.p2.isReady = true;
        if (this.p1.isReady && this.p2.isReady) {
          this.loop();
        }
        return;
      default:
        console.info('the fuck');
        return;
    }
  }
}
