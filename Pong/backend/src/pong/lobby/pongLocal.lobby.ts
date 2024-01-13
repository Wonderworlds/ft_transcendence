import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { GameState, LimitedUserDto } from '../../utils/Dtos';
import { Pong } from '../Pong';
import { Pong4p } from '../Pong4p';
import { PongLobby } from './pong.lobby';

export type UpdateLobbyDto = {
  nbPlayer: number;
  pLeftReady: boolean;
  pRightReady: boolean;
  pTopReady?: boolean;
  pBotReady?: boolean;
  gameState: GameState;
  pLeft: LimitedUserDto;
  pRight: LimitedUserDto;
  pTop?: LimitedUserDto;
  pBot?: LimitedUserDto;
};

export class PongLobbyLocal extends PongLobby {
  @WebSocketServer()
  server: Server;
  private ownerIsIn: boolean = false;
  constructor(
    id: string,
    server: Server,
    owner: ValidSocket,
    gameType: GameType,
    protected readonly userService: UsersService,
  ) {
    super(id, server, owner, gameType, userService);
    if (gameType === GameType.classicLocal) this.maxClients = 2;
    if (gameType === GameType.multiplayerLocal) this.maxClients = 4;
  }

  override async addClient(
    @ConnectedSocket() client: ValidSocket,
    user: LimitedUserDto,
  ) {
    const oldClient = this.listClients.get(user.pseudo);
    if (oldClient && user.pseudo !== this.OwnerUser.pseudo) return;
    if (oldClient) return this.updateClient(client, oldClient, user);
    if (this.listClients.size >= this.maxClients) return;
    if (this.listClients.size === 0) {
      this.ownerIsIn = true;
      this.OwnerUser = user;
      client.join(this.id);
    }
    this.listClients.set(user.pseudo, client);
    this.userMap.set(user.pseudo, user);
    console.info('addClientLocal', user);
    if (
      this.listClients.size === 2 &&
      this.gameType === GameType.classicLocal
    ) {
      this.pLeft = this.OwnerUser;
      this.pRight = user;
      this.initMatch(this.pLeft, this.pRight);
      return;
    }
    if (
      this.listClients.size === 4 &&
      this.gameType === GameType.multiplayerLocal
    ) {
      const iterator = this.userMap.entries();
      this.pLeft = iterator.next().value[1];
      this.pRight = iterator.next().value[1];
      this.pTop = iterator.next().value[1];
      this.pBot = iterator.next().value[1];
      console.info('initMatch', this.pLeft, this.pRight, this.pTop, this.pBot);
      this.initMatch4p(this.pLeft, this.pRight, this.pTop, this.pBot);
      return;
    }
    this.serverUpdateClients();
  }

  override updateClient(
    @ConnectedSocket() client: ValidSocket,
    oldClient: ValidSocket,
    user: LimitedUserDto,
  ) {
    this.ownerIsIn = true;
    let timeout = this.mapTimeout.get(client.name);
    console.info('setCB ', timeout);
    clearTimeout(timeout);
    this.mapTimeout.delete(client.name);
    timeout = null;
    if (oldClient.id !== client.id) {
      oldClient.leave(this.id);
      this.OwnerUser === user;
      client.join(this.id);
      this.listClients.set(user.pseudo, client);
    }
    this.pongInstancePause(this.OwnerUser.pseudo);
    this.serverUpdateClients();
    console.info('updateClientLocal', client.id, oldClient.id);
  }

  override removeClient(@ConnectedSocket() client: ValidSocket) {
    console.info('removeClientLocal', client.name);
    this.ownerIsIn = false;
    this.pongInstancePause(this.OwnerUser.pseudo);
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
    if (
      this.gameType === GameType.classicLocal ||
      this.gameType === GameType.classicOnline
    )
      this.initMatch(this.pLeft, this.pRight);
    else return; //TODO next match in bracket
  }

  initMatch4p(
    pleft: LimitedUserDto,
    pright: LimitedUserDto,
    ptop: LimitedUserDto,
    pbot: LimitedUserDto,
  ) {
    if (this.status !== GameState.INIT) return;
    this.pongInstance = new Pong4p(
      this,
      this.id,
      this.server,
      pleft.pseudo,
      pright.pseudo,
      ptop.pseudo,
      pbot.pseudo,
    );
    this.status = GameState.START;
    this.serverUpdateClients();
    console.info('initMatchLocal', 'playerReady');
    this.server.to(this.owner.id).emit('isPlayerReady');
  }

  initMatch(pleft: LimitedUserDto, pright: LimitedUserDto) {
    if (this.status !== GameState.INIT) return;
    this.pongInstance = new Pong(
      this,
      this.id,
      this.server,
      pleft.pseudo,
      pright.pseudo,
    );
    this.status = GameState.START;
    this.serverUpdateClients();
    console.info('initMatchLocal', 'playerReady');
    this.server.to(this.owner.id).emit('isPlayerReady');
  }

  startMatch(pseudo: string) {
    if (this.gameType === GameType.classicLocal) {
      if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
      if (this.status !== GameState.START || !this.pongInstance) return;
      if (this.pongInstance.startMatch(this.pLeft.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pRight.pseudo))
        this.status = GameState.PLAYING;
    }
    if (this.gameType === GameType.multiplayerLocal) {
      console.info('startMatch', this.pongInstance.getPlayersReady());
      console.info('pseudo', pseudo, this.pLeft.pseudo, this.pRight.pseudo, this.pTop.pseudo, this.pBot.pseudo);
      if (
        this.pLeft.pseudo !== pseudo &&
        this.pRight.pseudo !== pseudo &&
        this.pTop.pseudo !== pseudo &&
        this.pBot.pseudo !== pseudo
      )
        return;
      console.info('startMatch', this.pongInstance.getPlayersReady());
        if (this.status !== GameState.START || !this.pongInstance) return;
      if (this.pongInstance.startMatch(this.pLeft.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pRight.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pTop.pseudo))
        this.status = GameState.PLAYING;
      if (this.pongInstance.startMatch(this.pBot.pseudo))
        this.status = GameState.PLAYING;
      console.info('startMatch', this.pongInstance.getPlayersReady());
    }
    this.serverUpdateClients();
  }

  private inputGameLocal(
    input: EventGame.UP | EventGame.DOWN,
    pseudo: string,
    p1: boolean,
  ) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    p1
      ? this.pongInstance.onInput(input, this.pLeft.pseudo)
      : this.pongInstance.onInput(input, this.pRight.pseudo);
  }

  private inputGameLocal4P(
    input: EventGame.LEFT | EventGame.RIGHT,
    pseudo: string,
    p3: boolean,
  ) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    const pongInstance4p = this.pongInstance as Pong4p;
    p3
      ? pongInstance4p.onInput(input, this.pTop.pseudo)
      : pongInstance4p.onInput(input, this.pBot.pseudo);
  }

  override onInput(
    @ConnectedSocket() client: ValidSocket,
    input: EventGame,
    pseudo: string,
  ) {
    switch (input) {
      case EventGame.ARROW_UP:
        return this.inputGameLocal(EventGame.UP, pseudo, false);
      case EventGame.ARROW_DOWN:
        return this.inputGameLocal(EventGame.DOWN, pseudo, false);
      case EventGame.W_KEY:
        return this.inputGameLocal(EventGame.UP, pseudo, true);
      case EventGame.S_KEY:
        return this.inputGameLocal(EventGame.DOWN, pseudo, true);
      case EventGame.ARROW_LEFT:
        return this.inputGameLocal4P(EventGame.LEFT, pseudo, false);
      case EventGame.ARROW_RIGHT:
        return this.inputGameLocal4P(EventGame.RIGHT, pseudo, false);
      case EventGame.A_KEY:
        return this.inputGameLocal4P(EventGame.LEFT, pseudo, true);
      case EventGame.D_KEY:
        return this.inputGameLocal4P(EventGame.RIGHT, pseudo, true);
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

  public getPlayers(): string[] {
    const players = [];
    for (const [key, value] of this.listClients.entries()) {
      if (key !== this.OwnerUser.pseudo) players.push(key);
    }
    console.info('getPlayers', players);
    return players;
  }

  public isOwnerConnected(): boolean {
    return this.ownerIsIn;
  }

  public isPseudoTaken(pseudo: string): boolean {
    return this.listClients.has(pseudo);
  }
}
