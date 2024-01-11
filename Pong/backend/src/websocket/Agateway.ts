import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { jwtConstants } from 'src/auth/utils';
import { UsersService } from 'src/users/users.service';
import { Status, UserJwt, ValidSocket } from 'src/utils/types';
import { WebsocketService } from './websocket.service';

@Injectable()
@WebSocketGateway()
export abstract class AGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  constructor(
    protected readonly websocketService: WebsocketService,
    private readonly jwtService: JwtService,
    protected readonly userService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.websocketService.server = this.server;
  }

  async handleConnection(@ConnectedSocket() user: ValidSocket): Promise<void> {
    
    user.name = user.handshake.query.name as string;
    const validUser = await this.validateJWT(
      user.handshake.query['Authorization'] as string,
    );
    if (!validUser) {
      user.disconnect();
      return;
    }
    const oldUser = this.websocketService.getUser(user.name);
    if (oldUser?.connected) {
      this.websocketService.addUser(user);
      oldUser.disconnect();
    } else
    this.websocketService.addUser(user);
    this.userService.updateUserById(validUser.userId, {
        status: Status.Online,
      });
  }

  async handleDisconnect(@ConnectedSocket() user: ValidSocket) {
    const oldUser = this.websocketService.getUser(user.name);
    if (user !== oldUser)
      return console.info(`User ${user.name} | Forced Disconnect`);
    console.info(`User ${user.name} | Disconnected`);
    setTimeout(() => {
      this.websocketService.removeUser(user);
    }, 1000 * 30);
    this.userService.updateUserByUsername(user.name, {
      status: Status.Offline,
    });
  }

  private async validateJWT(token: string): Promise<UserJwt> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return { userId: payload.sub, username: payload.user as string };
    } catch {
      return undefined;
    }
  }

  
  @SubscribeMessage('handshake')
  async handleHandshake(@ConnectedSocket() client: ValidSocket) {
      console.info(
        `User ${client.name} | Connected to PongGateway | wsID: ${client.id}`,
      );
      const user = await this.userService.findUserByUsername(client.name);
      const userDto = this.userService.userToDto(user);
      this.websocketService.serverMessage('reconnect', [client.id], {user: userDto});
  }
}
