import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
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
    protected websocketService: WebsocketService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
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
    this.userService.updateUserById(validUser.userId, {
      status: Status.Online,
    });
  }

  async handleDisconnect(@ConnectedSocket() user: ValidSocket) {
    console.info(`User ${user.name} | Disconnected`);
    setTimeout(() => {
      this.websocketService.removeUser(user);
    }, 1000 * 30);
    this.userService.updateUserByUsername(user.name, {
      status: Status.Offline,
    });
  }

  @SubscribeMessage('handshake')
  async handleHandshake(@ConnectedSocket() user: ValidSocket) {
    console.info("handshake");
    if (this.websocketService.getUser(user.name)) {
      console.info(
        `User ${user.name} | ReConnected to PongGateway | wsID: ${user.id}`,
      );
      this.server.to(user.id).emit('reconnect', {msg: "reconnected"});
    } else {
      console.info(
        `User ${user.name} | Connected to PongGateway | wsID: ${user.id}`,
      );
    }
    this.websocketService.addUser(user);
  }

  private async validateJWT(token: string): Promise<UserJwt> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return payload;
    } catch {
      return undefined;
    }
  }
}
