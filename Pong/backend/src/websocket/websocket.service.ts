import { Injectable } from '@nestjs/common';
import { ConnectedSocket } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ValidSocket } from 'src/utils/types';

@Injectable()
export class WebsocketService {
  public server: Server;
  public users: Map<string, ValidSocket> = new Map<string, ValidSocket>();

  public getUser(username: string): ValidSocket | undefined {
    return this.users.get(username);
  }

  public popUser(): ValidSocket {
    if (this.users.size == 0) return null;
    const iterator = this.users.values();
    let user = iterator.next().value;
    this.removeUser(user);
    return user;
  }

  public addUser(@ConnectedSocket() newUser: ValidSocket): void {
    this.users.set(newUser.name, newUser);
  }

  public removeUser(user: ValidSocket) {
    this.users.delete(user.name);
  }

  public sendMessage(
    @ConnectedSocket() user: ValidSocket,
    event: string,
    to?: string,
    messagePayload?: Object,
  ) {
    console.info(`event [${event}]`);
    messagePayload
      ? user.broadcast.emit(event, messagePayload)
      : user.broadcast.emit(event);
  }
  
  public serverMessage(event: string, to?: string, messagePayload?: Object) {
    console.info(`event [${event}]`);
    messagePayload
      ? to
        ? this.server.to(to).emit(event, messagePayload)
        : this.server.emit(event, messagePayload)
      : this.server.emit(event);
  }

  public serverError(to: string, message: string) {
    this.server.to(to).emit('error', message);
  }

  public updateUser(user: ValidSocket) {
    const old = this.users.get(user.name);
    if (old) old.disconnect();
    this.users.set(user.name, user);
  }

  public getUsersSize(): number {
    return this.users.size;
  }
}
