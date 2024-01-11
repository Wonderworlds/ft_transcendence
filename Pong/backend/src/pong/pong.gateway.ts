import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  CreateLobbyDto,
  InputLobbyDto,
  LobbyDto,
  LobbyIDDto,
  UserLobbyDto
} from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';
import { AGateway } from 'src/websocket/Agateway';
import { v4 as uuidv4 } from 'uuid';
import { PongLobby } from './pong.lobby';
import { PongLobbyLocal } from './pongLocal.lobby';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class PongGateway extends AGateway {
  protected listGame: Map<string, PongLobby | PongLobbyLocal> = new Map<string, PongLobby | PongLobbyLocal>();

  isClientPlaying(@ConnectedSocket() client: ValidSocket) {
    let gameId = '';
  }

  @SubscribeMessage('getLobbys')
  onGetLobbys(@ConnectedSocket() client: ValidSocket) {
    if (this.listGame.size === 0)
      return this.server.to(client.id).emit('lobbyList', { lobbys: [] });
    const lobbysDto: Array<LobbyDto> = [];
    let lobbyLocal: LobbyDto;
    for (const [key, value] of this.listGame.entries()) {
      if (value.isLocal && value.getOwner().name === client.name) {
        lobbyLocal = {
          id: key,
          owner: value.getOwner().name,
          nbPlayers: value.getSize(),
          maxPlayers: value.maxClients,
          gameType: value.gameType,
          status: value.status,
        };
        continue;
      } else if (value.isLocal || value.getSize() >= value.maxClients) continue;
      lobbysDto.push({
        id: key,
        owner: value.getOwner().name,
        nbPlayers: value.getSize(),
        maxPlayers: value.maxClients,
        gameType: value.gameType,
        status: value.status,
      });
    }
    console.info('getLobbys', { lobbysDto });
    this.server
      .to(client.id)
      .emit('lobbyList', { lobbys: lobbysDto, lobbyLocal: lobbyLocal });
  }

  @SubscribeMessage('createLobby')
  onCreateLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: CreateLobbyDto,
  ) {
    if (body.isLocal) {
      const lobby = this.isClientOwner(client);
      if (lobby !== '') this.listGame.delete(lobby);
    }
    console.info('createLobby', body);
    const id = uuidv4();
    let lobby: PongLobby | PongLobbyLocal;
    if (body.isLocal)
      lobby = new PongLobbyLocal(id, this.server, client, body.gameType);
    else
      lobby = new PongLobby(id, this.server, client, body.gameType);
    this.listGame.set(id, lobby);
    this.server.to(client.id).emit('lobbyCreated', { lobby: id });
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: InputLobbyDto,
  ) {
    console.info('onInputReceived', body);
    this.listGame.get(body.lobby).onInput(client, body.input, body.pseudo);
  }
  
    isClientOwner(client: ValidSocket) {
      for (const [key, value] of this.listGame.entries()) {
        if (value.getOwner().name === client.name) return key;
      }
      return '';
    }

  isClientinRoom(client: ValidSocket) {
    for (const [key, value] of this.listGame.entries()) {
      //console.info('isClientinRoom', value.listClients.keys(), client.name);
      if (value.listClients.has(client.name)) return key;
    }
    return this.isClientOwner(client);
    return '';
  }

  private lobbyToLobbyDto(lobby: PongLobby | PongLobbyLocal): LobbyDto {
    return {
      id: lobby.id,
      owner: lobby.getOwner().name,
      nbPlayers: lobby.getSize(),
      maxPlayers: lobby.maxClients,
      gameType: lobby.gameType,
      status: lobby.status,
    };
  }

  @SubscribeMessage('addClientLocal')
  onAddClientLocal(@ConnectedSocket() client: ValidSocket, @Body() body: UserLobbyDto) {
    console.info('onAddClientLocal', body);
    let {lobby, ...rest} = body;
    const lobbyRoom = this.listGame.get(lobby);
    if (!lobbyRoom) return;
    lobbyRoom.addClient(client, rest);
  }

  @SubscribeMessage('joinLobby')
  async onJoinLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: UserLobbyDto,
  ) {
    console.info('joinLobby', body);
    let {lobby, ...rest} = body;
    if (lobby === '') {
      lobby = this.isClientinRoom(client);
      if (lobby !== '')
        return this.server.to(client.id).emit('joinedLobby', this.lobbyToLobbyDto(this.listGame.get(lobby)));
      return this.server.to(client.id).emit('joinedLobby', { id: '' });
    }
    if (!this.listGame.has(lobby)) {
      this.server.to(client.id).emit('joinedLobby', { id: '' });
      return;
    }
    this.listGame.get(lobby).addClient(client, rest);
    this.server.to(client.id).emit('joinedLobby', this.lobbyToLobbyDto(this.listGame.get(lobby)));
  }

  @SubscribeMessage('leaveLobby')
  onLeaveLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: LobbyIDDto,
  ) {
    console.info('leaveLobby', body);
    const lobby = this.listGame.get(body.lobby);
    if (!lobby) return;
    lobby?.removeClient(client);
    setTimeout(() => {
      if (lobby?.getSize() !== 0) return;
      this.listGame.delete(body.lobby);
      console.info('leaveLobbyCB', 'Lobby deleted');
    }, 1000 * 20);
  }

  @SubscribeMessage('start')
  onStart(@ConnectedSocket() client: ValidSocket, @Body() body: LobbyIDDto) {
//    console.info('onStart', body);
    // this.listGame.get(body.lobby).startGame(client);
  }

}
