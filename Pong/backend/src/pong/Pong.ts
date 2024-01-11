import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UpdateGameDto } from 'src/utils/Dtos';
import { EventGame, Pos } from 'src/utils/types';
import { PongLobby } from './pong.lobby';

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
  public name: string;
  public isReady = false;

  constructor(name: string, pos: Pos) {
    this.setPosition(pos);
    this.name = name;
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
  private running: boolean = true;
  private scoreEnd = 10;
  private functionEnd: (log: any) => void;
  private p1: Player;
  private p2: Player;
  private lobby: PongLobby;
  constructor(
    id: string,
    server: Server,
    p1: string,
    p2: string,
    lobby: PongLobby,
  ) {
    this.id = id;
    this.server = server;
    this.p1 = new Player(p1, { x: 2, y: 50 });
    this.p2 = new Player(p2, { x: 98, y: 50 });
    this.lobby = lobby;
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
    if (
      this.p1.getScore() < this.scoreEnd &&
      this.p2.getScore() < this.scoreEnd
    )
      return 0;
    return 1;
  }

  loop = () => {
    setTimeout(this.loop, 1000 / 48);
    if (!this.running) return;
    this.ball.move(this.p1, this.p2);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());

    if (this.checkScore()) {
      this.lobby.pongInstanceEnd(this.getMatchLog());
      this.pause();
      return;
    }
  };

  public getPlayersReady() {
    return {
      p1: this.p1.isReady,
      p2: this.p2.isReady,
    };
  }

  
  public getPlayersName() {
    return {
      p1: this.p1.name,
      p2: this.p2.name,
    };
  }

  
  public setPlayersName(p1?: string, p2?: string) {
      this.p1.name = p1 ? p1 : this.p1.name;
      this.p2.name = p2 ? p2 : this.p2.name;
  }

  public pause() {
    console.info('pause' );
    this.running = !this.running;
  }

  public startMatch(pseudo: string) {
    if (pseudo === this.p1.name) this.p1.isReady = true;
    if (pseudo === this.p2.name) this.p2.isReady = true;
    if (this.p1.isReady && this.p2.isReady) {
      this.loop();
      return true;
    }
    return false;
  }

  public onInput(
    @ConnectedSocket() input: EventGame.UP | EventGame.DOWN,
    pseudo: string,
  ) {
    if (!this.running) return;
    if (pseudo === this.p1.name) {
      this.p1.changePos(input);
    } else if (pseudo === this.p2.name) {
      this.p2.changePos(input);
    }
  }

  private getMatchLog() {
    return {
      p1: this.p1.name,
      p2: this.p2.name,
      scoreP1: this.p1.getScore(),
      scoreP2: this.p2.getScore(),
    };
  }
}
