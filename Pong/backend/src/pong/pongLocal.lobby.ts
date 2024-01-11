import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { GameState, LimitedUserDto } from './../utils/Dtos';
import { Pong } from './Pong';
import { PongLobby } from './pong.lobby';

export type UpdateLobbyDto = {
  nbPlayer: number;
  pLeftReady: boolean;
  pRightReady: boolean;
  gameState: GameState;
  pLeft: LimitedUserDto;
  pRight: LimitedUserDto;
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
    console.info('addClientLocal', user);
    if (
      this.listClients.size === 2 &&
      this.gameType === GameType.classicLocal
    ) {
    this.pLeft = this.OwnerUser;
      this.pRight = user;
      this.initMatch(this.pLeft, this.pRight);
      return ;
    }
    this.serverUpdateClients();
  }

  serverUpdateClients() {
    const lobbyState = this.getUpdateLobbyDto(true);
    this.server
      .to(this.id)
      .emit('updateLobby', lobbyState);
  }

  override updateClient(
    @ConnectedSocket() client: ValidSocket,
    oldClient: ValidSocket,
    user: LimitedUserDto,
  ) {
    this.ownerIsIn = true;
    if (this.mapTimeout.has(client.name))
    clearTimeout(this.mapTimeout.get(client.name));
  if (oldClient.id !== client.id){
    oldClient.leave(this.id);
    this.OwnerUser === user;
    client.join(this.id);
    this.listClients.set(user.pseudo, client);}
    this.serverUpdateClients();
    console.info('updateClientLocal', client.id, oldClient.id);
  }

  override removeClientCB(@ConnectedSocket() client: ValidSocket) {
    client.leave(this.id);
    this.listClients.delete(client.name);
    if (this.mapTimeout.has(client.name)) this.mapTimeout.delete(client.name);
    console.info('removeClientCB', client.id);
  }

  override removeClient(@ConnectedSocket() client: ValidSocket) {
    console.info('removeClientLocal', client.name);
    this.ownerIsIn = false;
    const id = setTimeout(() => {
      return this.removeClientCB(client);
    }, 1000 * 15);
    this.mapTimeout.set(client.name, id);
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
      if (this.gameType === GameType.classicLocal || this.gameType === GameType.classicOnline)
        this.initMatch(this.pLeft, this.pRight);
      else
        return ; //TODO next match in bracket
    }

  getUpdateLobbyDto(option: boolean): UpdateLobbyDto {
    const pReady = this.pongInstance?.getPlayersReady();
    return {
      nbPlayer: this.listClients.size,
      pLeftReady: pReady?.p1,
      pRightReady: pReady?.p2,
      gameState: this.status,
      pLeft: option? this.pLeft : null,
      pRight: option? this.pRight : null,
    };
  }

  initMatch(pleft: LimitedUserDto, pright: LimitedUserDto) {
    if (this.status !== GameState.INIT) return;
    this.pongInstance = new Pong(
      this.id,
      this.server,
      pleft.pseudo,
      pright.pseudo,
      this,
    );
    this.status = GameState.START;
    this.serverUpdateClients();
    this.server
      .to(this.owner.id)
      .emit('isPlayerReady');
  }

  startMatch(pseudo: string) {
    if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
    if (this.status !== GameState.START || !this.pongInstance) return;
    if (this.pongInstance.startMatch(this.pLeft.pseudo)) this.status = GameState.PLAYING;
    if (this.pongInstance.startMatch(this.pRight.pseudo)) this.status = GameState.PLAYING;
    this.serverUpdateClients();
  }

  pongInstancePause(pseudo: string) {
    if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
    if (
      (this.status !== GameState.PLAYING && this.status !== GameState.PAUSE) ||
      !this.pongInstance
    )
      return;
    this.status = GameState.PAUSE;
    this.pongInstance.pause();
  }

  private inputGame(input: EventGame.UP | EventGame.DOWN, pseudo: string, p1: boolean) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    p1 ? this.pongInstance.onInput(input, this.pLeft.pseudo) : this.pongInstance.onInput(input, this.pRight.pseudo);
  }

  override onInput(
    @ConnectedSocket() client: ValidSocket,
    input: EventGame,
    pseudo: string,
  ) {
    console.info('onInput', input, pseudo);
    switch (input) {
      case EventGame.ARROW_UP:
        return this.inputGame(EventGame.UP, pseudo, false);
      case EventGame.ARROW_DOWN:
        return this.inputGame(EventGame.DOWN, pseudo, false);
      case EventGame.W_KEY:
        return this.inputGame(EventGame.UP, pseudo, true);
      case EventGame.S_KEY:
        return this.inputGame(EventGame.DOWN, pseudo, true);
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
}
