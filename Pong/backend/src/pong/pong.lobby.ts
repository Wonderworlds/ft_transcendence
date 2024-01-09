import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameType, ValidSocket } from 'src/utils/types';
import { Pong } from './Pong';

export class PongLobby {
  @WebSocketServer()
  server: Server;
  public listClients = new Map<string, ValidSocket>();
  public mapTimeout = new Map<string, NodeJS.Timeout>();
  public maxClients = 24;
  public gameType: GameType;
  public status: 'waiting' | 'playing' = 'waiting';
  private owner: ValidSocket;
  private pLeft: ValidSocket;
  private pTop: ValidSocket;
  private pBottom: ValidSocket;
  private pRight: ValidSocket;
  public isLocal: boolean;
  public id: string;
  private pongInstance: Pong;

  constructor(
    id: string,
    server: Server,
    owner: ValidSocket,
    gameType: GameType,
    isLocal: boolean,
  ) {
    this.id = id;
    this.server = server;
    this.owner = owner;
    this.gameType = gameType;
    this.isLocal = isLocal;
    if (isLocal && this.gameType === GameType.classic) {
    }
  }

  addClient(@ConnectedSocket() client: ValidSocket) {
    const oldClient = this.listClients.get(client.name);
    if (oldClient) return this.updateClient(client, oldClient);
    client.join(this.id);
    this.listClients.set(client.name, client);
    console.info('addClient', client.id);
  }

  updateClient(@ConnectedSocket() client: ValidSocket, oldClient: ValidSocket) {
    if (this.mapTimeout.has(client.name))
      clearTimeout(this.mapTimeout.get(client.name));
    if (oldClient.id === client.id) return;
    oldClient.leave(this.id);
    if (this.owner === oldClient) this.owner = client;
    if (this.pLeft === oldClient) this.pLeft = client;
    else if (this.pTop === oldClient) this.pTop = client;
    else if (this.pBottom === oldClient) this.pBottom = client;
    else if (this.pRight === oldClient) this.pRight = client;
    client.join(this.id);
    this.listClients.set(client.name, client);
    console.info('updateClient', client.id, oldClient.id);
  }

  removeClientCB(client: ValidSocket) {
    client.leave(this.id);
    this.listClients.delete(client.name);
    if (client.id === this.owner.id && this.listClients.size > 0) {
      this.owner = this.listClients.values().next().value;
    }
    if (this.mapTimeout.has(client.name)) this.mapTimeout.delete(client.name);
    console.info('removeClientCB', client.id);
  }

  removeClient(@ConnectedSocket() client: ValidSocket) {
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

  public startGame() {
    console.info('startGame');
    this.status = 'playing';
    if (this.isLocal && this.gameType === GameType.classic) {
      this.pLeft = this.owner;
      this.pRight = this.owner;
      this.pongInstance = new Pong(this.id, this.server, this.owner);
    }
  }

  public onInput(@ConnectedSocket() client: ValidSocket, input: string) {
    if (this.status !== 'playing') return;
  }
}
