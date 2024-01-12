import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  AcceptLobbyDto,
  CreateCustomLobbyDto,
  CreateLobbyDto,
  InputLobbyDto,
  LobbyIDDto,
  UserLobbyDto,
} from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';
import { PongService } from './pong.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class PongGateway {
  public server: Server;

  constructor(
    public websocketService: WebsocketService,
    public pongService: PongService,
  ) {
  }

  @SubscribeMessage('getLobbys')
  onGetLobbys(@ConnectedSocket() client: ValidSocket) {
    const { lobbysDto, lobbyLocal } = this.pongService.getLobbys(client);
    console.info('getLobbys', { lobbysDto }, lobbyLocal);
    this.websocketService.serverMessage('lobbyList', [client.id], {
      lobbys: lobbysDto,
      lobbyLocal: lobbyLocal,
    });
  }

  @SubscribeMessage('createLobby')
  async onCreateLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: CreateLobbyDto,
  ) {
    console.info('createLobby', body);
    const id = this.pongService.createLobby(
      client,
      body,
      this.server,
    );
    this.websocketService.serverMessage('lobbyCreated', [client.id], {
      lobby: id,
    });
  }

  @SubscribeMessage('responseFriendGame')
  onResponseCustomGame(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: AcceptLobbyDto,
  ) {
    console.info('responseFriendGame', body);
    const res = this.pongService.responseFriendGame(
      client,
      body,
      this.websocketService,
    );
    res.event === 'error' ?
      this.websocketService.serverError(res.to, res.messagePayload as string) :
      this.websocketService.serverMessage(res.event, res.to, res.messagePayload);
  }

  @SubscribeMessage('customGame')
  async onCustomGame(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: CreateCustomLobbyDto,
  ) {
    console.info('customGame', body);
    const res = await this.pongService.customGame(
      client,
      body,
      this.server,
      this.websocketService,
    );
    res.event === 'error' ?
      this.websocketService.serverError(res.to, res.messagePayload as string) :
      this.websocketService.serverMessage(res.event, res.to, res.messagePayload);
  }

  @SubscribeMessage('joinLobby')
  async onJoinLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: LobbyIDDto,
  ) {
    console.info('joinLobby', body);
    const res = await this.pongService.joinLobby(client, body);
    this.websocketService.serverMessage(res.event, res.to, res.messagePayload);
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: InputLobbyDto,
  ) {
    this.pongService.inputReceived(client, body);
  }

  @SubscribeMessage('addClientLocal')
  async onAddClientLocal(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: UserLobbyDto,
  ) {
    console.info('onAddClientLocal', body);
    const res = this.pongService.addClientLocal(client, body);
    this.websocketService.serverError(res.to, res.messagePayload);
  }

  @SubscribeMessage('leaveLobby')
  onLeaveLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: LobbyIDDto,
  ) {
    console.info('leaveLobby', body);
    this.pongService.leaveLobby(client, body);
  }
}
