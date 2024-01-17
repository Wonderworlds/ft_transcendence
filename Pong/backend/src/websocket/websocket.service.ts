import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { jwtConstants } from 'src/auth/utils';
import { UserJwt, ValidSocket } from 'src/utils/types';

@Injectable()
export class WebsocketService {
  public server: Server;
  public users: Map<string, ValidSocket> = new Map<string, ValidSocket>();
  public usersJWT: Map<string, NodeJS.Timeout> = new Map<
    string,
    NodeJS.Timeout
  >();
  public usersRooms: Map<string, string> = new Map<string, string>();

  constructor(private readonly jwtService: JwtService) {}

  public getUser(username: string): ValidSocket | undefined {
    return this.users.get(username);
  }

  public addUser(@ConnectedSocket() newUser: ValidSocket): void {
    const oldLobby = this.usersRooms.get(newUser.name);
    console.info(`event [addUser] ${newUser.name}`, oldLobby);
    if (oldLobby) {
      newUser.lobby = oldLobby;
    }
    this.users.set(newUser.name, newUser);
  }

  public removeUser(user: ValidSocket) {
      const client = this.users.get(user.name)
      if (client && client.id !== user.id)  return ;
      this.users.delete(user.name);
      this.usersRooms.set(user.name, user.lobby);
  }

  public serverMessage(event: string, to?: string[], messagePayload?: Object) {
    console.info(`event [${event}]`);
    messagePayload
      ? to
        ? this.server.to(to).emit(event, messagePayload)
        : this.server.emit(event, messagePayload)
      : this.server.emit(event);
  }

  public serverError(to: string[], message: string) {
    this.server.to(to).emit('error', message);
  }

  public getUsersSize(): number {
    return this.users.size;
  }

  public getUsersFromLobby(lobbyId: string): string[] {
    const users: string[] = [];
    this.users.forEach((user) => {
      if (user.rooms.has(lobbyId)) users.push(user.name);
    });
    return users;
  }

  async validateJWT(token: string): Promise<UserJwt> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const exp = payload.exp - new Date().getTime() / 1000;
      const id = setTimeout(
        () => {
          const user = this.users.get(payload.user);
          if (!user) return;
          this.serverMessage('forcedDisconnect', [user.id], {
            message: 'JWT Expired',
          });
          this.usersJWT.delete(payload.user);
        },
        1000 * (exp + 1),
      );
      const old = this.usersJWT.get(payload.user);
      if (old) clearTimeout(old);
      this.usersJWT.set(payload.user, id);
      return { userId: payload.sub, username: payload.user as string };
    } catch {
      return undefined;
    }
  }
}
