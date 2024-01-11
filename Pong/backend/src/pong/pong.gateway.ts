import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import {
  AcceptLobbyDto,
  CreateCustomLobbyDto,
  CreateLobbyDto,
  InputLobbyDto,
  LobbyDto,
  LobbyIDDto,
  UserLobbyDto,
} from 'src/utils/Dtos';
import { GameType, ValidSocket } from 'src/utils/types';
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
  protected listGameOnline: Map<string, PongLobby> = new Map<
    string,
    PongLobby
  >();
  protected listGameLocal: Map<string, PongLobbyLocal> = new Map<
    string,
    PongLobbyLocal
  >();

  protected listCustomGame: Map<string, PongLobby> = new Map<
    string,
    PongLobby
  >();

  @SubscribeMessage('getLobbys')
  onGetLobbys(@ConnectedSocket() client: ValidSocket) {
    const lobbysDto: Array<LobbyDto> = [];
    let lobbyLocal: LobbyDto = null;
    for (const [key, value] of this.listGameLocal.entries()) {
      if (value.getOwner().name === client.name) {
        lobbyLocal = this.lobbyToLobbyDto(value);
        break;
      }
    }
    for (const [key, value] of this.listGameOnline.entries()) {
      if (value.getSize() >= value.maxClients) continue;
      lobbysDto.push(this.lobbyToLobbyDto(value));
    }
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
    if (body.isLocal) {
      const lobby = this.isClientOwner(client, this.listGameLocal);
      if (lobby !== '') this.listGameLocal.delete(lobby);
    }
    console.info('createLobby', body);
    const id = uuidv4();
    if (body.isLocal) {
      const lobby = new PongLobbyLocal(
        id,
        this.server,
        client,
        body.gameType,
        this.userService,
      );
      this.listGameLocal.set(id, lobby);
    } else {
      const lobby = new PongLobby(
        id,
        this.server,
        client,
        body.gameType,
        this.userService,
      );
      this.listGameOnline.set(id, lobby);
    }
    this.websocketService.serverMessage('lobbyCreated', [client.id], {
      lobby: id,
    });
  }
  private customGamePending: Array<{lobby: string, owner: string, receiver: string}> = [];

  @SubscribeMessage('responseFriendGame')
  refuseCustomGame(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: AcceptLobbyDto,
  ) {
    console.info('refuseFriendGame', body);
    const index = this.customGamePending.findIndex((e) => e.lobby === body.lobby);
    const customGame = this.customGamePending[index];
    if (!index) return this.websocketService.serverError([client.id], 'Lobby not found');
    const socket1 = this.websocketService.getUser(customGame.owner);
    if (body.accept) {
      this.customGamePending.splice(index, 1);
      const socket2 = this.websocketService.getUser(customGame.receiver);
      this.websocketService.serverMessage('friendGame', [socket1.id, socket2.id], {accept: body.accept, lobby: body.lobby});
    }
    this.websocketService.serverMessage('friendGame', [socket1.id], {accept: body.accept, lobby: body.lobby});
  }

  @SubscribeMessage('customGame')
  async onCustomGame(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: CreateCustomLobbyDto,
  ) {
    console.info('customGame', body);
    const FriendUser = await this.userService.findUserByPseudo(body.friend);
    if (!FriendUser)
      return this.websocketService.serverError([client.id], 'User not found');
    const friend = this.websocketService.getUser(FriendUser.username);
    if (!friend)
      return this.websocketService.serverError([client.id], 'User not Online');
    const id = uuidv4();
    const lobby = new PongLobby(
      id,
      this.server,
      client,
      GameType.classicOnline,
      this.userService,
      2,
    );
    this.listCustomGame.set(id, lobby);
    this.customGamePending.push({lobby: id, owner: client.name, receiver: friend.name});
    setTimeout(() => {
      if (lobby.getSize() !== 2) return;
      this.listCustomGame.delete(id);
      this.customGamePending.splice(this.customGamePending.findIndex((e) => e.lobby === id), 1);
      console.info('customGameCB', 'Lobby deleted');
    }, 1000 * 20);
    this.websocketService.serverMessage('friendGame', [friend.id], {
      message: 'Hey ! Wanna Play ?',
      lobby: id,
      sender: body.owner,
    });
  }

  @SubscribeMessage('joinLobby')
  async onJoinLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: LobbyIDDto,
  ) {
    console.info('joinLobby', body);
    const lobbyRoomID =
      body.lobby ||
      this.isClientOwner(client, this.listGameLocal) ||
      this.isClientinRoom(client);
    if (!lobbyRoomID)
      return this.websocketService.serverMessage('joinedLobby', [client.id], {
        id: '',
      });
    const lobbyRoom =
      this.listGameLocal.get(lobbyRoomID) ||
      this.listGameOnline.get(lobbyRoomID) ||
      this.listCustomGame.get(lobbyRoomID);
    if (!lobbyRoom)
      return this.websocketService.serverMessage('joinedLobby', [client.id], {
        id: '',
      });
    const user = await this.userService.findOneUser(
      { username: client.name },
      [],
      ['pseudo', 'ppImg', 'status'],
    );
    if (!user)
      return this.websocketService.serverMessage('joinedLobby', [client.id], {
        id: '',
      });
    lobbyRoom.addClient(client, user);
    this.websocketService.serverMessage(
      'joinedLobby',
      [client.id],
      this.lobbyToLobbyDto(lobbyRoom),
    );
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: InputLobbyDto,
  ) {
    const lobby =
      this.listGameLocal.get(body.lobby) ||
      this.listGameOnline.get(body.lobby) ||
      this.listCustomGame.get(body.lobby);
    lobby.onInput(client, body.input, body.pseudo);
  }

  isClientOwner(
    client: ValidSocket,
    array: Map<string, PongLobby | PongLobbyLocal>,
  ) {
    for (const [key, value] of array.entries()) {
      if (value.getOwner().name === client.name) return key;
    }
    return '';
  }

  isClientinRoom(client: ValidSocket) {
    for (const [key, value] of this.listGameOnline.entries()) {
      if (value.listClients.has(client.name)) return key;
    }
    return '';
  }

  private lobbyToLobbyDto(lobby: PongLobby | PongLobbyLocal): LobbyDto {
    return {
      id: lobby.id,
      owner: lobby.getOwnerPseudo(),
      nbPlayers: lobby.getSize(),
      maxPlayers: lobby.maxClients,
      gameType: lobby.gameType,
      status: lobby.status,
    };
  }

  @SubscribeMessage('addClientLocal')
  async onAddClientLocal(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: UserLobbyDto,
  ) {
    console.info('onAddClientLocal', body);
    let { lobby, ...rest } = body;
    const lobbyRoom = this.listGameLocal.get(lobby);
    if (!lobbyRoom) return;
    const user = await this.userService.findUserByPseudo(rest.pseudo);
    console.log(user);
    if (user)
      return this.websocketService.serverError(
        [client.id],
        'Pseudo already taken',
      );
    lobbyRoom.addClient(client, rest);
  }

  @SubscribeMessage('leaveLobby')
  onLeaveLobby(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: LobbyIDDto,
  ) {
    console.info('leaveLobby', body);
    const lobbyLocal = this.listGameLocal.get(body.lobby);
    const lobbyOnline = this.listGameOnline.get(body.lobby);
    const lobbyCustom = this.listCustomGame.get(body.lobby);
    if (!lobbyLocal && !lobbyOnline && !lobbyCustom) return;
    if (lobbyLocal) {
      lobbyLocal.removeClient(client);
      setTimeout(() => {
        if (lobbyLocal?.isOwnerConnected()) return;
        console.info('leaveLobbyCB', 'Lobby deleted');
        this.listGameLocal.delete(body.lobby);
      }, 1000 * 20);
    } else if (lobbyOnline) {
      lobbyOnline.removeClient(client);
      setTimeout(() => {
        if (lobbyOnline?.getSize() !== 0) return;
        console.info('leaveLobbyCB', 'Lobby deleted');
        this.listGameOnline.delete(body.lobby);
      }, 1000 * 20);
    } else if (lobbyCustom) {
      lobbyCustom.removeClient(client);
      setTimeout(() => {
        if (lobbyCustom?.getSize() !== 0) return;
        console.info('leaveLobbyCB', 'Lobby deleted');
        this.listCustomGame.delete(body.lobby);
      }, 1000 * 20);
    }
  }
}
