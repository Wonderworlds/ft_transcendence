import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidSocket } from 'src/utils/types';
import { Pong } from './Pong';

export class PongLobby {

@WebSocketServer()
server: Server;
  private listClients = new Map<string, ValidSocket>();
  private maxClients = 24;
  private pLeft: ValidSocket;
  private pRight: ValidSocket;
  public id: string;
  private pongInstance: Pong;
  constructor(id: string, pLeft: ValidSocket, pRight: ValidSocket) {
    this.id = id;
    this.pLeft = pLeft;
    this.pRight = pRight;
  }

  async addClient(@ConnectedSocket() client: ValidSocket) {
	client.join(this.id);
	this.listClients.set(client.name, client);
  }
  
   removeClient(@ConnectedSocket() client: ValidSocket) {
	client.leave(this.id);
	this.listClients.delete(client.name)
}
}
