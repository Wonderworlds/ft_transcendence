import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GameState, LimitedUserDto } from 'src/utils/Dtos';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { Pong } from '../Pong';
import { Pong4p } from '../Pong4p';
import { UpdateLobbyDto } from './pongLocal.lobby';

export class PongLobby {
  @WebSocketServer()
  server: Server;
  public listClients = new Map<string, ValidSocket>();
  protected mapTimeout = new Map<string, NodeJS.Timeout>();
  protected userMap = new Map<string, LimitedUserDto>();
  public maxClients = 24;
  public gameType: GameType;
  public status: GameState = GameState.INIT;
  protected owner: ValidSocket;
  protected pLeft: LimitedUserDto = null;
  protected pRight: LimitedUserDto = null;
  protected pBot: LimitedUserDto = null;
  protected pTop: LimitedUserDto = null;
  public isLocal: boolean;
  public id: string;
  protected pongInstance: Pong | Pong4p;
  protected OwnerUser: LimitedUserDto;
  public isMultiplayer: boolean = false;
  constructor(
    id: string,
    server: Server,
    owner: ValidSocket,
    gameType: GameType,
    protected readonly userService: UsersService,
    size?: number,
  ) {
    this.id = id;
    this.server = server;
    this.owner = owner;
    this.gameType = gameType;
    if (gameType === GameType.classicOnline) this.maxClients = 2;
    if (gameType === GameType.multiplayerOnline) this.maxClients = 4;
    size ? (this.maxClients = size) : null;
  }

  async addClient(
    @ConnectedSocket() client: ValidSocket,
    user: LimitedUserDto,
  ) {
    client.join(this.id);
    const oldClient = this.listClients.get(client.name);
    if (oldClient) return this.updateClient(client, oldClient, user);
    if (this.listClients.size === 0) {
      this.owner = client;
      this.OwnerUser = user;
    }
    this.listClients.set(client.name, client);
    this.userMap.set(client.name, user);
    console.info('addClient', client.id);
    if (
      this.listClients.size >= 2 &&
      this.gameType === GameType.classicOnline
    ) {
      this.initMatchStart();
    }
    if (
      this.listClients.size >= 4 &&
      this.gameType === GameType.multiplayerOnline
    ) {
      this.initMatchStart();
    }
  }

  updateClient(
    @ConnectedSocket() client: ValidSocket,
    oldClient: ValidSocket,
    user: LimitedUserDto,
  ) {
    let timeout = this.mapTimeout.get(client.name);
    timeout && this.mapTimeout.delete(client.name) && clearTimeout(timeout);
    timeout = null;
    const oldPseudo = this.userMap.get(oldClient.name).pseudo;
    if (oldClient.id === client.id) {
      this.userMap.set(client.name, user);
    } else {
      oldClient.leave(this.id);
      if (this.owner === oldClient) this.owner = client;
      this.listClients.set(client.name, client);
      this.userMap.set(client.name, user);
    }
    if (this.pLeft && this.pLeft.pseudo === oldPseudo) {
      this.pLeft = user;
      this.pongInstance?.setPlayersName(user.pseudo, null);
    }
    if (this.pRight && this.pRight.pseudo === oldPseudo) {
      this.pRight = user;
      this.pongInstance?.setPlayersName(null, user.pseudo);
    }
    //multiplayer?
    console.info('updateClient', client.id, oldClient.id);
    this.serverUpdateClients();
    if (this.status === GameState.START)
      this.server.to(this.id).emit('isPlayerReady');
  }

  removeClientCB(client: ValidSocket) {
    this.listClients.delete(client.name);
    this.userMap.delete(client.name);
    if (client.id === this.owner.id && this.listClients.size > 0) {
      const newOwner = this.listClients.values().next().value;
      this.owner = newOwner;
      this.OwnerUser = this.userMap.get(newOwner.name);
    }
    if (this.mapTimeout.has(client.name)) this.mapTimeout.delete(client.name);
    console.info('removeClientCB', client.id);
    this.serverUpdateClients();
  }

  removeClient(@ConnectedSocket() client: ValidSocket): void | boolean {
    console.info('removeClient', client.id);
    client.leave(this.id);
    if (this.status === GameState.GAMEOVER) return this.forcedLeave();
    if (this.listClients.size === 1)
      return this.listClients.delete(client.name);
    const id = setTimeout(() => {
      return this.removeClientCB(client);
    }, 1000 * 15);
    this.mapTimeout.set(client.name, id);
  }

  getSize() {
    return this.listClients.size;
  }

  getOwner() {
    return this.owner;
  }

  initTournament() {
    if (this.status !== GameState.INIT) return;
    //create tournament bracket
    this.status = GameState.START;
    //initMatch();
  }

  nextMatch() {
    if (this.status !== GameState.GAMEOVER) return;
    this.status = GameState.INIT;
    this.pongInstance = null;
    this.server.to(this.id).emit('gameOver', false);
    if (
      this.gameType === GameType.classicLocal ||
      this.gameType === GameType.classicOnline
    )
      this.initMatch(this.pLeft, this.pRight);
    else if (
      this.gameType ===
      (GameType.multiplayerOnline || GameType.multiplayerLocal)
    ) {
      this.initMatch(this.pLeft, this.pRight, this.pTop, this.pBot);
    } else return; //TODO next match in bracket
  }

  getSocketFromPseudo(pseudo: string): ValidSocket | undefined {
    const name = this.userMap.get(pseudo)?.pseudo;
    return this.listClients.get(name);
  }

  initMatchStart() {
    const iterator = this.userMap.entries();
    this.pLeft = iterator.next().value[1];
    this.pRight = iterator.next().value[1];
    if (this.gameType === GameType.multiplayerOnline) {
      this.pTop = iterator.next().value[1];
      this.pBot = iterator.next().value[1];
    }
    this.initMatch(this.pLeft, this.pRight, this.pTop, this.pBot);
  }

  initMatch(
    pleft: LimitedUserDto,
    pright: LimitedUserDto,
    ptop?: LimitedUserDto,
    pbot?: LimitedUserDto,
  ) {
    if (this.gameType === GameType.classicOnline) {
      this.pongInstance = new Pong(
        this,
        this.id,
        this.server,
        pleft.pseudo,
        pright.pseudo,
      );
    } else if (this.gameType === GameType.multiplayerOnline) {
      this.pongInstance = new Pong4p(
        this,
        this.id,
        this.server,
        pleft.pseudo,
        pright.pseudo,
        ptop.pseudo,
        pbot.pseudo,
      );
    }
    this.status = GameState.START;
    this.serverUpdateClients();
    this.server.to(this.id).emit('isPlayerReady');
  }

  startMatch(pseudo: string) {
    if (this.pongInstance) {
      this.pongInstance.startMatch(pseudo)
        ? (this.status = GameState.PLAYING)
        : null;
      this.serverUpdateClients();
    }
  }

  private inputGame(input: EventGame.UP | EventGame.DOWN, pseudo: string) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    if (pseudo === this.pLeft.pseudo || pseudo === this.pRight.pseudo) {
      this.pongInstance.onInput(input, pseudo);
    }
  }

  private inputGame4P(input: EventGame.LEFT | EventGame.RIGHT, pseudo: string) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    if (pseudo === this.pRight.pseudo || pseudo === this.pBot.pseudo) {
      const pong4p = this.pongInstance as Pong4p;
      pong4p.onInput(input, pseudo);
    }
  }

  public onInput(
    @ConnectedSocket() client: ValidSocket,
    input: EventGame,
    pseudo: string,
  ) {
    switch (input) {
      case EventGame.ARROW_UP:
        return this.inputGame(EventGame.UP, pseudo);
      case EventGame.ARROW_DOWN:
        return this.inputGame(EventGame.DOWN, pseudo);
      case EventGame.W_KEY:
        return this.inputGame(EventGame.UP, pseudo);
      case EventGame.S_KEY:
        return this.inputGame(EventGame.DOWN, pseudo);
      case EventGame.ARROW_LEFT:
        return this.inputGame4P(EventGame.LEFT, pseudo);
      case EventGame.ARROW_RIGHT:
        return this.inputGame4P(EventGame.RIGHT, pseudo);
      case EventGame.A_KEY:
        return this.inputGame4P(EventGame.LEFT, pseudo);
      case EventGame.D_KEY:
        return this.inputGame4P(EventGame.RIGHT, pseudo);
      case EventGame.START_MATCH:
        return this.startMatch(pseudo);
      case EventGame.START_TOURNAMENT:
        return this.initTournament();
      case EventGame.PAUSE:
        return this.pongInstancePause(pseudo);
      case EventGame.NEXT:
        return this.nextMatch();
    }
  }

  public async pongInstanceEnd(log: any) {
    const matchLog = {
      gameType: this.gameType,
      ...log,
    };
    console.info('game over', matchLog, this.id);
    this.status = GameState.GAMEOVER;
    this.server.to(this.id).emit('gameOver', matchLog);
    if (
      this.gameType === GameType.classicOnline ||
      this.gameType === GameType.multiplayerOnline ||
      this.gameType === GameType.tournamentOnline
    ) {
      return await this.userService.createMatchDB(matchLog);
    }
  }
  public getOwnerPseudo() {
    return this.OwnerUser.pseudo;
  }

  getUpdateLobbyDto(): UpdateLobbyDto {
    const pong4p = this.pongInstance as Pong4p;
    const pReady = pong4p?.getPlayersReady();
    let ret = {
      nbPlayer: this.listClients.size,
      pLeftReady: pReady?.p1,
      pRightReady: pReady?.p2,
      gameState: this.status,
      pLeft: this.pLeft,
      pRight: this.pRight,
    };
    if (
      this.gameType === GameType.classicOnline ||
      this.gameType === GameType.classicLocal
    ) {
      if (this.status === GameState.INIT && this.pLeft && this.pRight) {
        this.status = GameState.START;
        ret.gameState = GameState.START;
      }
      return ret;
    }
    console.info('getUpdateLobbyDto', this.pTop, this.pBot);
    if (
      this.pLeft &&
      this.pRight &&
      this.pTop &&
      this.pBot &&
      this.status === GameState.INIT
    ) {
      this.status = GameState.START;
      ret.gameState = GameState.START;
    }
    return {
      ...ret,
      pTop: this.pTop,
      pBot: this.pBot,
      pTopReady: pReady?.p3,
      pBotReady: pReady?.p4,
    };
  }

  pongInstanceUnpause(pseudo: string) {
    if (!this.pongInstance) return;
    if (this.status !== GameState.PAUSE) return;
    if (
      this.gameType === GameType.classicOnline ||
      this.gameType === GameType.classicLocal
    ) {
      if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
      this.status = GameState.PLAYING;
      this.pongInstance.pause();
      return;
    }
    if (
      this.gameType === GameType.multiplayerOnline ||
      this.gameType === GameType.multiplayerLocal
    ) {
      if (
        this.pLeft.pseudo !== pseudo &&
        this.pRight.pseudo !== pseudo &&
        this.pTop.pseudo !== pseudo &&
        this.pBot.pseudo !== pseudo
      )
        return;
      this.status = GameState.PLAYING;
      this.pongInstance.pause();
    }
  }

  pongInstancePause(pseudo: string) {
    if (!this.pongInstance) return;
    console.info('pongInstancePause', this.status);
    if (this.status !== GameState.PLAYING) return;
    console.info('pongInstancePause', this.status);
    if (
      this.gameType === GameType.classicOnline ||
      this.gameType === GameType.classicLocal
    ) {
      console.info('pongInstancePause', this.status);
      if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
      this.status = GameState.PAUSE;
      this.pongInstance.pause();
      console.info('pause', this.status);
      return;
    }
    console.info('pongInstancePause', this.gameType);
    if (
      this.gameType === GameType.multiplayerOnline ||
      this.gameType === GameType.multiplayerLocal
    ) {
      console.info('pongInstancePause', this.status);
      if (
        this.pLeft.pseudo !== pseudo &&
        this.pRight.pseudo !== pseudo &&
        this.pTop.pseudo !== pseudo &&
        this.pBot.pseudo !== pseudo
      )
        return;
      console.info('pongInstancePause', this.status);
      this.status = GameState.PAUSE;
      this.pongInstance.pause();
    }
  }

  serverUpdateClients() {
    const lobbyState = this.getUpdateLobbyDto();
    this.server.to(this.id).emit('updateLobby', lobbyState);
  }
  public forcedLeave() {
    this.server.to(this.id).emit('forcedLeave', 'Lobby closed');
    this.listClients.forEach((client) => {
      client.leave(this.id);
    });
  }
}
