import { Injectable } from '@nestjs/common';
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
    lobbyRejoin: LobbyDto;
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
    const index = this.isClientinRoom(client);
    let lobbyRejoin = null;
    if (index)
      lobbyRejoin = this.lobbyToLobbyDto(this.listGameOnline.get(index));
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
      );
      this.listGameLocal.set(id, lobby);
    } else {
      const lobby = new PongLobby(
        id,
        server,
        client,
        body.gameType,
        this.userService,
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
        event: 'responseFriendGame',
        to: [socket1.id, client.id],
        messagePayload: { accept: body.accept, lobby: body.lobby },
      };
    } else {
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
  ): Promise<{ event: string; to: string[]; messagePayload: Object }> {
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
      2,
    );
    this.listCustomGame.set(id, lobby);
    this.customGamePending.push({
      lobby: id,
      owner: client.name,
      receiver: friend.name,
    });
    setTimeout(() => {
      console.info('customGameCB', 'Lobby size', lobby.getSize());
      if (lobby.getSize() === 2) return;
      websocketService.serverError([client.id], 'Game declined');
      this.listCustomGame.delete(id);
      this.customGamePending.splice(
        this.customGamePending.findIndex((e) => e.lobby === id),
        1,
      );
      console.info('customGameCB', 'Lobby deleted', id);
    }, 1000 * 20);
    console.info('customGameCreate', this.customGamePending);
    return {
      event: 'friendGame',
      to: [friend.id],
      messagePayload: {
        message: 'Hey! Wanna Play?',
        lobby: id,
        sender: body.owner,
      },
    };
  }

  async joinLobby(
    client: ValidSocket,
    body: LobbyIDDto,
  ): Promise<{ event: string; to: string[]; messagePayload: Object }> {
    const lobbyRoomID =
      body.lobby ||
      this.isClientOwner(client, this.listGameLocal) ||
      this.isClientinRoom(client);
    if (!lobbyRoomID)
      return {
        event: 'joinedLobby',
        to: [client.id],
        messagePayload: { id: '' },
      };
    const lobbyRoom =
      this.listGameLocal.get(lobbyRoomID) ||
      this.listGameOnline.get(lobbyRoomID) ||
      this.listCustomGame.get(lobbyRoomID);
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
      console.info('leaveLobbyCB', 'Lobby deleted');
      return this.listGameOnline.delete(body.lobby);
    }
    setTimeout(() => {
      if (
        lobbyOnline?.gameType === GameType.classicOnline &&
        lobbyOnline?.status === GameState.INIT
      )
        return;
      lobbyOnline?.forcedLeave();
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
        if (lobbyLocal?.isOwnerConnected()) return;
        console.info('leaveLobbyCB', 'Lobby deleted');
        this.listGameLocal.delete(body.lobby);
      }, 1000 * 20);
    } else if (lobbyCustom) {
      lobbyCustom.removeClient(client);
      setTimeout(() => {
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

  private isClientinRoom(client: ValidSocket) {
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
}