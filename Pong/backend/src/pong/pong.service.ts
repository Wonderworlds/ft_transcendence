import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import {
  AcceptLobbyDto,
  CreateCustomLobbyDto,
  CreateLobbyDto,
  GameState,
  InputLobbyDto,
  LobbyDto,
  LobbyIDDto,
  UserLobbyDto,
} from 'src/utils/Dtos';
import { GameType, ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';
import { v4 as uuidv4 } from 'uuid';
import { PongLobby } from './lobby/pong.lobby';
import { PongLobbyLocal } from './lobby/pongLocal.lobby';

@Injectable()
export class PongService {
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

  constructor(public userService: UsersService) {
    console.info('PongService', 'Service created');
  }

  getLobbys(client: ValidSocket): {
    lobbysDto: LobbyDto[];
    lobbyLocal: LobbyDto;
    lobbyRejoin: LobbyDto[];
  } {
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
    const lobbyRejoin: LobbyDto[] = this.isClientinRooms(client).map((e) => this.lobbyToLobbyDto(e));
    return { lobbysDto, lobbyLocal, lobbyRejoin };
  }

  createLobby(
    client: ValidSocket,
    body: CreateLobbyDto,
    server: Server,
  ): string {
    if (body.isLocal) {
      const lobby = this.isClientOwner(client, this.listGameLocal);
      if (lobby !== '') this.listGameLocal.delete(lobby);
    }
    const id = uuidv4();
    if (body.isLocal) {
      const lobby = new PongLobbyLocal(
        id,
        server,
        client,
        body.gameType,
        this.userService,
        this.destroyLobby.bind(this),
      );
      this.listGameLocal.set(id, lobby);
    } else {
      const lobby = new PongLobby(
        id,
        server,
        client,
        body.gameType,
        this.userService,
        this.destroyLobby.bind(this),
      );
      this.listGameOnline.set(id, lobby);
    }
    return id;
  }

  public customGamePending: Array<{
    lobby: string;
    owner: string;
    receiver: string;
  }> = [];

  responseFriendGame(
    client: ValidSocket,
    body: AcceptLobbyDto,
    websocketService: WebsocketService,
  ): { event: string; to: string[]; messagePayload: Object } {
    const index = this.customGamePending.findIndex(
      (e) => e.lobby === body.lobby,
    );
    console.log('responseFriendGame', this.customGamePending, index);
    const customGame = this.customGamePending[index];
    if (index === -1)
      return {
        event: 'error',
        to: [client.id],
        messagePayload: 'Lobby not found',
      };
    const socket1 = websocketService.getUser(customGame.owner);
    if (!socket1)
      return {
        event: 'error',
        to: [client.id],
        messagePayload: 'User not Online',
      };
    this.customGamePending.splice(index, 1);
    if (body.accept) {
      return {
        event: 'forcedMove',
        to: [socket1.id, client.id],
        messagePayload: { lobby: body.lobby },
      };
    } else {
      this.listCustomGame.delete(body.lobby);
      return {
        event: 'error',
        to: [socket1.id],
        messagePayload: 'Game Declined',
      };
    }
  }

  async customGame(
    client: ValidSocket,
    body: CreateCustomLobbyDto,
    server: Server,
    websocketService: WebsocketService,
  ): Promise<{
    event: string;
    to: string[];
    messagePayload: string | { lobby: string; sender: string };
  }> {
    if (this.customGamePending.find((e) => e.owner === client.name))
      return {
        event: 'error',
        to: [client.id],
        messagePayload: 'You already have a pending game',
      };
    const FriendUser = await this.userService.findUserByPseudo(body.friend);
    if (!FriendUser)
      return {
        event: 'error',
        to: [client.id],
        messagePayload: 'Target not found',
      };
    if (FriendUser.username === client.name)
      return {
        event: 'error',
        to: [client.id],
        messagePayload: "You can't play with yourself",
      };
    const friend = websocketService.getUser(FriendUser.username);
    if (!friend)
      return {
        event: 'error',
        to: [client.id],
        messagePayload: 'User not Online',
      };
    const id = uuidv4();
    const lobby = new PongLobby(
      id,
      server,
      client,
      GameType.classicOnline,
      this.userService,
      this.destroyLobby.bind(this),
    );
    this.listCustomGame.set(id, lobby);
    this.customGamePending.push({
      lobby: id,
      owner: client.name,
      receiver: friend.name,
    });
    setTimeout(() => {
      const invitPendingIndex = this.customGamePending.findIndex(
        (e) => e.lobby === id,
      );
      if (invitPendingIndex === -1) return;
      console.info('customGameCB', 'Lobby size', lobby.getSize());
      websocketService.serverError([client.id], 'Game declined');
      this.listCustomGame.delete(id);
      this.customGamePending.splice(invitPendingIndex, 1);
      console.info('customGameCB', 'Lobby deleted', id);
    }, 1000 * 20);
    console.info('customGameCreate', this.customGamePending);
    return {
      event: 'friendGame',
      to: [friend.id],
      messagePayload: {
        lobby: id,
        sender: body.owner,
      },
    };
  }

  private clientInRoom(@ConnectedSocket() client: ValidSocket) {
    console.info('clientInRoom', client.name, client.lobby);
    if (!client.lobby) return null;
    const lobby =
      this.listGameLocal.get(client.lobby) ||
      this.listGameOnline.get(client.lobby) ||
      this.listCustomGame.get(client.lobby);
    if (lobby && lobby.listClients.has(client.name)) return lobby;
  }

  async joinLobby(
    client: ValidSocket,
    body: LobbyIDDto,
  ): Promise<{ event: string; to: string[]; messagePayload: Object }> {
    if (!body.lobby) {
      const lobbyRoom = this.clientInRoom(client);
      if (!lobbyRoom) {
        return {
          event: 'joinedLobby',
          to: [client.id],
          messagePayload: { id: '' },
        };
      }
      return {
        event: 'joinedLobby',
        to: [client.id],
        messagePayload: this.lobbyToLobbyDto(lobbyRoom),
      };
    }
    const lobbyRoom =
      this.listGameLocal.get(body.lobby) ||
      this.listGameOnline.get(body.lobby) ||
      this.listCustomGame.get(body.lobby);
    if (!lobbyRoom)
      return {
        event: 'joinedLobby',
        to: [client.id],
        messagePayload: { id: '' },
      };
    const user = await this.userService.findOneUser(
      { username: client.name },
      [],
      ['pseudo', 'ppImg', 'status', 'id'],
    );
    if (!user)
      return {
        event: 'joinedLobby',
        to: [client.id],
        messagePayload: { id: '' },
      };
    lobbyRoom.addClient(client, user);
    return {
      event: 'joinedLobby',
      to: [client.id],
      messagePayload: this.lobbyToLobbyDto(lobbyRoom),
    };
  }

  inputReceived(client: ValidSocket, body: InputLobbyDto) {
    const lobby =
      this.listGameLocal.get(body.lobby) ||
      this.listGameOnline.get(body.lobby) ||
      this.listCustomGame.get(body.lobby);
    if (!lobby) return;
    lobby.onInput(client, body.input, body.pseudo);
  }

  addClientLocal(
    client: ValidSocket,
    body: UserLobbyDto,
  ): { to: string[]; messagePayload: string } {
    let { lobby, ...rest } = body;
    const lobbyRoom = this.listGameLocal.get(lobby);
    if (!lobbyRoom) return;
    const isTaken = lobbyRoom.isPseudoTaken(rest.pseudo);
    if (isTaken)
      return { to: [client.id], messagePayload: 'Pseudo already taken' };
    lobbyRoom.addClient(client, rest);
    return { to: [client.id], messagePayload: rest.pseudo + ' joined' };
  }

  private leaveLobbyOnline(
    client: ValidSocket,
    lobbyOnline: PongLobby,
    body: LobbyIDDto,
  ) {
    lobbyOnline.removeClient(client);
    if (lobbyOnline.getSize() === 0) {
      lobbyOnline.forcedLeave();
      console.info('leaveLobbyCB', 'Lobby deleted');
      return this.listGameOnline.delete(body.lobby);
    }
    setTimeout(() => {
      if (!lobbyOnline) return;
      if (this.isClientInLobby(client, lobbyOnline)) return;
      if (lobbyOnline.status !== GameState.GAMEOVER) return;
      lobbyOnline.forcedLeave();
      if (this.listGameOnline.delete(body.lobby))
        console.info('leaveLobbyCB', 'Lobby deleted');
    }, 1000 * 20);
  }

  leaveLobby(client: ValidSocket, body: LobbyIDDto) {
    const lobbyLocal = this.listGameLocal.get(body.lobby);
    const lobbyOnline = this.listGameOnline.get(body.lobby);
    const lobbyCustom = this.listCustomGame.get(body.lobby);
    if (!lobbyLocal && !lobbyOnline && !lobbyCustom) return;
    if (lobbyLocal) {
      lobbyLocal.removeClient(client);
      setTimeout(() => {
        if (!lobbyLocal) return;
        if (lobbyLocal?.isOwnerConnected()) return;
        console.info('leaveLobbyCB', 'Lobby deleted');
        this.listGameLocal.delete(body.lobby);
      }, 1000 * 20);
    } else if (lobbyCustom) {
      lobbyCustom.removeClient(client);
      setTimeout(() => {
        if (!lobbyCustom) return;
        if (lobbyCustom?.getSize() === 2) return;
        lobbyCustom?.forcedLeave();
        this.listCustomGame.delete(body.lobby);
        console.info('leaveLobbyCB', 'Lobby deleted');
      }, 1000 * 20);
    } else this.leaveLobbyOnline(client, lobbyOnline, body);
  }

  private isClientOwner(
    client: ValidSocket,
    array: Map<string, PongLobby | PongLobbyLocal>,
  ) {
    for (const [key, value] of array.entries()) {
      if (value.getOwner().name === client.name) return key;
    }
    return '';
  }

  private isClientInLobby(
    @ConnectedSocket() client: ValidSocket,
    lobbyRoom: PongLobby,
  ) {
    if (lobbyRoom.listClients.has(client.name)) return true;
    return false;
  }

  private isClientinRooms(client: ValidSocket) : Array<PongLobby> {
    const lobbys: PongLobby[] = [];
    for (const [key, value] of this.listGameOnline.entries()) {
      if (value.listClients.has(client.name)) lobbys.push(value);
    }
    return lobbys;
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

  public destroyLobby(lobbyID: string) {
    setTimeout(() => {
      const lobby =
        this.listGameOnline.get(lobbyID) ||
        this.listGameLocal.get(lobbyID) ||
        this.listCustomGame.get(lobbyID);
      if (!lobby) return;
      lobby.forcedLeave();
      if (this.listGameOnline.delete(lobby.id))
        console.info('destroyLobby', 'Lobby deleted');
    }, 1000 * 10);
  }
}
