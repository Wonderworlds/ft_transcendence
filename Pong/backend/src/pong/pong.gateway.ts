import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  CreateLobbyDto,
  LobbyDto,
  inputLobbyDto,
  lobbyIDDto,
} from 'src/utils/Dtos';
import { EventGame, GameType, ValidSocket } from 'src/utils/types';
import { AGateway } from 'src/websocket/Agateway';
import { v4 as uuidv4 } from 'uuid';
import { PongLobby } from './pong.lobby';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class PongGateway extends AGateway {
  protected listGame: Map<string, PongLobby> = new Map<string, PongLobby>();

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
      const lobby = this.isClientOwner(client, body.gameType);
      if (lobby !== '') this.listGame.delete(lobby);
    }
    console.info('createLobby', body);
    const id = uuidv4();
    const lobby = new PongLobby(id, this.server, client, body.gameType, body.isLocal);
    this.listGame.set(id, lobby);
    this.server.to(client.id).emit('lobbyCreated', { lobby: id });
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: inputLobbyDto,
  ) {
    if (body.input === EventGame.SPACE_KEY )
		this.listGame.get(body.lobby).startGame();
	else
		this.listGame.get(body.lobby).onInput(client, body.input);

    // this.listGame.get(body.lobby).onInput(client, body.input);
  }

  isClientinRoom(client: ValidSocket) {
    for (const [key, value] of this.listGame.entries()) {
      console.info('isClientinRoom', value.listClients.keys(), client.name);
      if (value.listClients.has(client.name)) return key;
    }
    return '';
  }

  isClientOwner(client: ValidSocket, gameType: GameType) {
    for (const [key, value] of this.listGame.entries()) {
      if (value.getOwner().name === client.name) return key;
    }
    return '';
  }

  @SubscribeMessage('joinLobby')
  onJoinLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: lobbyIDDto,
  ) {
    console.info('joinLobby', body);
    if (body.lobby === '') {
      const lobby = this.isClientinRoom(client);
      if (lobby !== '')
        return this.server.to(client.id).emit('joinedLobby', { lobby: lobby });
      return this.server.to(client.id).emit('joinedLobby', { lobby: '' });
    }
    if (!this.listGame.has(body.lobby)) {
      this.server.to(client.id).emit('joinedLobby', { lobby: '' });
      return;
    }
    this.listGame.get(body.lobby).addClient(client);
    this.server.to(client.id).emit('joinedLobby', { lobby: body.lobby });
    console.info('lobbyList', this.listGame);
  }

  @SubscribeMessage('leaveLobby')
  onLeaveLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: lobbyIDDto,
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
  onStart(@ConnectedSocket() client: ValidSocket, @Body() body: lobbyIDDto) {
    console.info('onStart', body);
    this.listGame.get(body.lobby).startGame();
  }

}
