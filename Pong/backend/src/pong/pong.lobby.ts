import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { GameState, LimitedUserDto } from 'src/utils/Dtos';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { Pong } from './Pong';

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
  ) {
    this.id = id;
    this.server = server;
    this.owner = owner;
    this.gameType = gameType;
    this.gameType = gameType;
  }

  async addClient(@ConnectedSocket() client: ValidSocket, user: LimitedUserDto) {
    const oldClient = this.listClients.get(client.name);
    if (oldClient) return this.updateClient(client, oldClient, user);
    client.join(this.id);
    this.listClients.set(client.name, client);
    this.userMap.set(client.name, user);
    console.info('addClient', client.id);
  }

  updateClient(@ConnectedSocket() client: ValidSocket, oldClient: ValidSocket, user: LimitedUserDto) {
    if (this.mapTimeout.has(client.name))
      clearTimeout(this.mapTimeout.get(client.name));
    if (oldClient.id === client.id) return;
    oldClient.leave(this.id);
    // if (this.owner === oldClient) this.owner = client;
    // if (this.pLeft === oldClient) this.pLeft = client;
    // else if (this.pTop === oldClient) this.pTop = client;
    // else if (this.pBottom === oldClient) this.pBottom = client;
    // else if (this.pRight === oldClient) this.pRight = client;
    client.join(this.id);
    this.listClients.set(client.name, client);
    this.userMap.set(client.name, user);
    console.info('updateClient', client.id, oldClient.id);
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

  removeClient(@ConnectedSocket() client: ValidSocket) : void | boolean{
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

  setReady(@ConnectedSocket() client: ValidSocket) {
  	const index = Array.from(this.listClients.values()).indexOf(client);
	// this.ready[index] = true;
  }

  private checkReady() {
    switch (this.gameType) {
      case GameType.classicLocal: return 
      case GameType.tournamentLocal:
      case GameType.classicOnline:
      case GameType.multiplayerOnline:
      case GameType.tournamentOnline:
    }
  }

	// if (this.isLocal && this.gameType === GameType.classic)
	// 	return true;
	// else if (this.gameType === GameType.classic)
	// 	return this.ready.reduce((a, b) => +a + +b, 0) === 2;
	// else if (this.gameType === GameType.multiplayer)
	// 	return this.ready.reduce((a, b) => +a + +b, 0) === 4;
	// return false;
  // }

  // public startGame(@ConnectedSocket() client: ValidSocket) {
	// if (this.status === GameState.PLAYING) return;
  //   if (this.isLocal && this.gameType === GameType.classic) {
	// 	this.pLeft = this.owner;
	// 	this.pRight = this.owner;
	// 	this.status = GameState.PLAYING;
	// 	this.pongInstance = new Pong(this.id, this.server, this.owner, this.owner);
  //   }
	// else if (this.gameType === GameType.classic) {
	// 	this.setReady(client);
	// 	if (this.checkReady()) {
	// 		this.pLeft = this.owner;
	// 		this.pRight = Array.from(this.listClients.values()).filter((value) => value !== this.owner)[0];
	// 		this.status = GameState.PLAYING;
	// 		this.pongInstance = new Pong(this.id, this.server, this.pLeft, this.pRight);
	// 	}
	// }
  // }

  public async pongInstanceEnd(log: any) {
    const matchLog = {
      gameType: this.gameType,
      ...log,
    };
    console.info('game over', matchLog, this.id);
    this.status = GameState.GAMEOVER;
    this.server
    .to(this.id)
    .emit('gameOver', matchLog);
    return await this.userService.createMatchDB(matchLog);
  }

  public onInput(@ConnectedSocket() client: ValidSocket, input: EventGame, pseudo: string) {
    // if (this.status !== GameState.PLAYING && client === this.pLeft || client === this.pRight) return;
		//   this.pongInstance.onInput(client, input);
  }

  public getOwnerPseudo() {
    return this.OwnerUser.pseudo;
  }


}
