import { Server } from 'socket.io';
import { UpdateGameDto } from 'src/utils/Dtos';
import { EventGame, Pos } from 'src/utils/types';
import { Ball, Player, Pong } from './Pong';
import { PongLobby } from './lobby/pong.lobby';

class Ball4p extends Ball {
  private handleDeath: (zone: 'TOP' | 'BOT' | 'LEFT' | 'RIGHT') => void;
  constructor(handleDeath: (zone: 'TOP' | 'BOT' | 'LEFT' | 'RIGHT') => void) {
    super();
    this.handleDeath = handleDeath;
  }

  public move4P(
    pLeft: PlayerHorizontal,
    pRight: PlayerHorizontal,
    pTop: PlayerHorizontal,
    pBot: PlayerHorizontal,
  ) {
    //check collision with walls
    if (this.position.x + 2 < 2) {
      if (pLeft.isAlive) {
        this.position = { x: 50, y: 50 };
        this.direction = this.normalize(this.getRandomDirection());
        return this.handleDeath('LEFT');
      } else {
        this.direction.x += 1;
      }
    } else if (this.position.x > 99) {
      if (pRight.isAlive) {
        this.position = { x: 50, y: 50 };
        this.direction = this.normalize(this.getRandomDirection());
        return this.handleDeath('RIGHT');
      } else {
        this.direction.x += -1;
      }
    } else if (this.position.y + 2 < 2) {
      if (pTop.isAlive) {
        this.position = { x: 50, y: 50 };
        this.direction = this.normalize(this.getRandomDirection());
        return this.handleDeath('TOP');
      } else {
        this.direction.y += 1;
      }
    } else if (this.position.y > 99) {
      if (pBot.isAlive) {
        this.position = { x: 50, y: 50 };
        this.direction = this.normalize(this.getRandomDirection());
        return this.handleDeath('BOT');
      } else {
        this.direction.y += -1;
      }
    }

    this.position.x += this.direction.x * this.speed;
    this.position.y += this.direction.y * this.speed;
  }
}

class PlayerHorizontal extends Player {
  public isHorizontal: boolean = true;
  public isAlive: boolean = true;
  public lives: number = 3;
  protected maxX = 88;
  constructor(name: string, position: Pos) {
    super(name, position);
  }

  public override changePos(event: EventGame) {
    if (!this.isHorizontal) {
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
    } else {
      if (event === EventGame.LEFT && this.position.x > 0) {
        if (this.position.x - this.speed > 0) {
          this.position.x -= this.speed;
        } else {
          this.position.x = 0;
        }
      } else if (event === EventGame.RIGHT && this.position.x < this.maxX) {
        if (this.position.x + this.speed < this.maxX) {
          this.position.x += this.speed;
        } else {
          this.position.x = this.maxX;
        }
      }
    }
  }
}

export class Pong4p extends Pong {
  public ball4p: Ball4p;
  public pLeft: PlayerHorizontal;
  public pRight: PlayerHorizontal;
  public pTop: PlayerHorizontal;
  public pBot: PlayerHorizontal;
  constructor(
    lobby: PongLobby,
    id: string,
    server: Server,
    pLeft: string,
    pRight: string,
    pTop: string,
    pBot: string,
  ) {
    super(lobby, id, server);
    this.id = id;
    this.server = server;
    this.pLeft = new PlayerHorizontal(pLeft, { x: 2, y: 50 });
    this.pLeft.isHorizontal = false;
    this.pRight = new PlayerHorizontal(pRight, { x: 98, y: 50 });
    this.pRight.isHorizontal = false;
    this.pTop = new PlayerHorizontal(pTop, { x: 50, y: 2 });
    this.pBot = new PlayerHorizontal(pBot, { x: 50, y: 98 });
    this.ball4p = new Ball4p(this.handleDeath.bind(this));
  }
  private pAlive: boolean[] = [true, true, true, true];
  private handleDeath(zone: 'TOP' | 'BOT' | 'LEFT' | 'RIGHT') {
    switch (zone) {
      case 'TOP':
        this.pTop.lives--;
        if (this.pTop.lives <= 0) {
          this.pTop.isAlive = false;
          this.pAlive[0] = false;
        }
        break;
      case 'BOT':
        this.pBot.lives--;
        if (this.pBot.lives <= 0) {
          this.pBot.isAlive = false;
          this.pAlive[1] = false;
        }
        break;
      case 'LEFT':
        this.pLeft.lives--;
        if (this.pLeft.lives <= 0) {
          this.pLeft.isAlive = false;
          this.pAlive[2] = false;
        }
        break;
      case 'RIGHT':
        this.pRight.lives--;
        if (this.pRight.lives <= 0) {
          this.pRight.isAlive = false;
          this.pAlive[3] = false;
        }
        break;
    }
    if (this.pAlive.filter((e) => e).length <= 1) {
      this.handleWin();
    }
  }

  override handleWin() {
    this.pause();
    this.lobby.pongInstanceEnd(this.getMatchLog());
  }

  override getMatchLog() {
    const log = {
      p1: this.pLeft.name,
      p2: this.pRight.name,
      p3: this.pTop.name,
      p4: this.pBot.name,
      scoreP1: this.pLeft.lives,
      scoreP2: this.pRight.lives,
      scoreP3: this.pTop.lives,
      scoreP4: this.pBot.lives,
    };
    return log;
  }

  public override getStateOfGame() {
    const stateOfGame: UpdateGameDto = {
      ball: this.ball4p.getPosition(),
      pLeft: this.p1.getPosition(),
      pRight: this.p2.getPosition(),
      scorePLeft: this.p1.getScore(),
      scorePRight: this.p2.getScore(),
      pTop: this.pTop.getPosition(),
      pBot: this.pBot.getPosition(),
      scorePTop: this.pTop.getScore(),
      scorePBot: this.pBot.getScore(),
    };
    return stateOfGame;
  }

  override loop = () => {
    setTimeout(this.loop, 1000 / 48);
    if (!this.running) return;
    this.ball4p.move4P(this.pLeft, this.pRight, this.pTop, this.pBot);
    this.server.to(this.id).emit('updateGame', this.getStateOfGame());
  };

  public override getPlayersReady() {
    return {
      p1: this.pLeft.isReady,
      p2: this.pRight.isReady,
      p3: this.pTop.isReady,
      p4: this.pBot.isReady,
    };
  }

  public override getPlayersName() {
    return {
      p1: this.pLeft.name,
      p2: this.pRight.name,
      p3: this.pTop.name,
      p4: this.pBot.name,
    };
  }

  public override setPlayersName(
    p1?: string,
    p2?: string,
    p3?: string,
    p4?: string,
  ) {
    this.pLeft.name = p1 ? p1 : this.pLeft.name;
    this.pRight.name = p2 ? p2 : this.pRight.name;
    this.pTop.name = p3 ? p3 : this.pTop.name;
    this.pBot.name = p4 ? p4 : this.pBot.name;
  }

  public override startMatch(pseudo: string): boolean {
    if (pseudo === this.pLeft.name) this.pLeft.isReady = true;
    else if (pseudo === this.pRight.name) this.pRight.isReady = true;
    else if (pseudo === this.pTop.name) this.pTop.isReady = true;
    else if (pseudo === this.pBot.name) this.pBot.isReady = true;
    if (
      this.pLeft.isReady &&
      this.pRight.isReady &&
      this.pTop.isReady &&
      this.pBot.isReady
    ) {
      this.loop();
      return true;
    }
    return false;
  }

  public override onInput(
    input: EventGame.UP | EventGame.DOWN | EventGame.LEFT | EventGame.RIGHT,
    pseudo: string,
  ): void {
    if (!this.running) return;
    switch (pseudo) {
      case this.pLeft.name:
        return this.pLeft.changePos(input);
      case this.pRight.name:
        return this.pRight.changePos(input);
      case this.pTop.name:
        return this.pTop.changePos(input);
      case this.pBot.name:
        return this.pBot.changePos(input);
    }
  }
}
