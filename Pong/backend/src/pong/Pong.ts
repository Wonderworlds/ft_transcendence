import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UpdateGameDto } from 'src/utils/Dtos';
import { EventGame, Pos } from 'src/utils/types';
import { PongLobby } from './lobby/pong.lobby';

export class Ball {
  protected position: Pos = { x: 50, y: 50 };
  protected direction: Pos;
  protected speed = 0.8;

  constructor() {
    this.setDirection(this.normalize(this.getRandomDirection()));
  }

  public setDirection(newDir: Pos) {
    this.direction = newDir;
  }

  protected dist(a: number, b: number) {
    return Math.abs(b - a);
  }

  public move(p1: Player, p2: Player) {
    //check collision with walls
    if (this.position.x + 2 < 2) {
      this.position = { x: 50, y: 50 };
      this.direction = this.normalize(this.getRandomDirection());
      return p2.addScore();
    } else if (this.position.x > 99) {
      this.position = { x: 50, y: 50 };
      this.direction = this.normalize(this.getRandomDirection());
      return p1.addScore();
    }

    this.checkColision(p1, p2);

    if (this.position.y <= 0) {
      this.direction.y = 1;
      this.direction = this.normalize(this.direction);
    } else if (this.position.y + 2 >= 100) {
      this.direction.y = -1;
      this.direction = this.normalize(this.direction);
  }
    
    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
  }

  protected checkColision(p1: Player, p2: Player) {
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

  protected getRandomDirection() {
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

  protected normalize(dir: Pos): Pos {
    const norme = Math.sqrt(dir.x * dir.x + dir.y * dir.y);
    return { x: dir.x / norme, y: dir.y / norme };
  }

  public onCollision() {}
}

export class Player {
  protected position: Pos;
  protected speed = 2;
  protected maxY = 88;
  protected score = 0;
  private scoreToWin = 2;
  private handleWin: () => void;
  public name: string;
  public isReady = false;
  constructor(
    name: string,
    pos: Pos,
    handleWin?: () => void,
    scoreToWin?: number,
  ) {
    this.setPosition(pos);
    this.name = name;
    if (scoreToWin)
      this.scoreToWin = scoreToWin;
    if (handleWin)
      this.handleWin = handleWin;
  }

  public getPosition() {
    return this.position;
  }

  public getScore() {
    return this.score;
  }

  public addScore() {
    this.score++;
    if (this.score >= this.scoreToWin) {
      this.handleWin();
    }
  }

  protected setPosition(newPos: Pos) {
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
  protected running: boolean = true;
  protected scoreEnd = 10;
  protected p1: Player;
  protected p2: Player;
  protected lobby: PongLobby;
  constructor(
    lobby: PongLobby,
    id: string,
    server: Server,
    p1?: string,
    p2?: string,
  ) {
    this.id = id;
    this.server = server;
    this.p1 = new Player(p1, { x: 2, y: 50 },  this.handleWin.bind(this),this.scoreEnd);
    this.p2 = new Player(p2, { x: 98, y: 50 },  this.handleWin.bind(this), this.scoreEnd);
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

  handleWin() {
    this.lobby.pongInstanceEnd(this.getMatchLog());
    this.pause();
  }

  loop = () => {
    setTimeout(this.loop, 1000 / 48);
    if (!this.running) return;
    this.ball.move(this.p1, this.p2);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());
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

  public setPlayersName(p1?: string, p2?: string, p3?: string, p4?: string) {
    this.p1.name = p1 ? p1 : this.p1.name;
    this.p2.name = p2 ? p2 : this.p2.name;
  }

  public pause() {
    console.info('pause');
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
    @ConnectedSocket()
    input: EventGame.UP | EventGame.DOWN,
    pseudo: string,
  ) {
    if (!this.running) return;
    if (this.p1.name === pseudo) return this.p1.changePos(input);
    this.p2.changePos(input);
  }

  getMatchLog(){
    return {
      p1: this.p1.name,
      p2: this.p2.name,
      scoreP1: this.p1.getScore(),
      scoreP2: this.p2.getScore(),
    };
  }
}
