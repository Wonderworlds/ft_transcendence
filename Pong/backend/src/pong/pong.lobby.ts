import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GameState, LimitedUserDto } from 'src/utils/Dtos';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { Pong } from './Pong';
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
  protected pLeft: LimitedUserDto;
  protected pRight: LimitedUserDto;
  public isLocal: boolean;
  public id: string;
  protected pongInstance: Pong;
  protected OwnerUser: LimitedUserDto;

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
    if (gameType === GameType.classicOnline) this.maxClients = 8;
    size ? (this.maxClients = size) : null;
  }

  async addClient(
    @ConnectedSocket() client: ValidSocket,
    user: LimitedUserDto,
  ) {
    const oldClient = this.listClients.get(client.name);
    if (oldClient) return this.updateClient(client, oldClient, user);
    client.join(this.id);
    if (this.listClients.size === 0) {
      this.owner = client;
      this.OwnerUser = user;
    }
    this.listClients.set(client.name, client);
    this.userMap.set(client.name, user);
    console.info('addClient', client.id);
    if (this.listClients.size >= 2 && this.gameType === GameType.classicOnline) {
      this.initMatchClassicOnline();
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
      client.join(this.id);
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
  }

  removeClientCB(client: ValidSocket) {
    client.leave(this.id);
    this.listClients.delete(client.name);
    this.userMap.delete(client.name);
    if (client.id === this.owner.id && this.listClients.size > 0) {
      this.owner = this.listClients.values().next().value;
    }
    if (this.mapTimeout.has(client.name)) this.mapTimeout.delete(client.name);
    console.info('removeClientCB', client.id);
  }

  removeClient(@ConnectedSocket() client: ValidSocket): void | boolean {
    console.info('removeClient', client.id);
    if (this.listClients.size === 1 && !this.isLocal)
      return this.listClients.delete(client.name);
    const id = setTimeout(() => {
      return this.removeClientCB(client);
    }, 1000 * 10);
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
      if (this.gameType === GameType.classicLocal || this.gameType === GameType.classicOnline)
        this.initMatch(this.pLeft, this.pRight);
      else
        return ; //TODO next match in bracket
    }

    getSocketFromPseudo(pseudo: string) : ValidSocket | undefined {
      const name = this.userMap.get(pseudo)?.pseudo;
      return this.listClients.get(name);
      }

  initMatchClassicOnline() {
    this.server
      .to(this.id)
      .emit('isPlayerReady');
      this.serverUpdateClients();
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
    const pLeftSocket = this.getSocketFromPseudo(pleft.pseudo);
    const pRightSocket = this.getSocketFromPseudo(pright.pseudo);
    this.server
      .to([pLeftSocket.id, pRightSocket.id])
      .emit('isPlayerReady');
  }

  startMatch(pseudo: string) {
    if (this.gameType === GameType.classicOnline && this.status === GameState.INIT) 
      {const user = this.userMap.get(pseudo);
        console.info('startMatch', user);
      if (!user) return;
      if (this.pLeft && this.pRight) return;
      !this.pLeft ? this.pLeft = user : this.pRight = user;
      if (this.pLeft && this.pRight) {
        console.info('startMatch', this.pLeft, this.pRight);
        this.initMatch(this.pLeft, this.pRight);
        this.serverUpdateClients();
      }
    }
      else if(this.pongInstance){
        this.pongInstance.startMatch(pseudo) ? this.status = GameState.PLAYING : null; 
        this.serverUpdateClients();
  }
};

  private inputGame(input: EventGame.UP | EventGame.DOWN, pseudo: string) {
    if (this.status !== GameState.PLAYING || !this.pongInstance) return;
    if (pseudo === this.pLeft.pseudo || pseudo === this.pRight.pseudo) {
      this.pongInstance.onInput(input, pseudo);
    }
  };

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
    return await this.userService.createMatchDB(matchLog);
  }

  public getOwnerPseudo() {
    return this.OwnerUser.pseudo;
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
  
  pongInstancePause(pseudo: string) {
    if (!this.pongInstance) return;
    if (this.pLeft.pseudo !== pseudo && this.pRight.pseudo !== pseudo) return;
    if (
      this.status !== GameState.PLAYING && this.status !== GameState.PAUSE
    )
      return;
    this.status = GameState.PAUSE;
    this.pongInstance.pause();
  }

  
  serverUpdateClients() {
    const lobbyState = this.getUpdateLobbyDto(true);
    this.server
      .to(this.id)
      .emit('updateLobby', lobbyState);
  }

}
