import { UsePipes, ValidationPipe } from '@nestjs/common';
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
import { ChatGateway } from 'src/chat/chat.gateway';
import { PongGateway } from 'src/pong/pong.gateway';
import { UsersService } from 'src/users/users.service';
import { Status, ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class Gateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;

  constructor(
    protected readonly websocketService: WebsocketService,
    protected readonly userService: UsersService,
    private readonly pongGateway: PongGateway,
    private readonly chatGateway: ChatGateway,
  ) {
  }

  afterInit(server: Server) {
    this.pongGateway.websocketService = this.websocketService;
    this.chatGateway.websocketService = this.websocketService;
    this.websocketService.server = this.server;
    this.pongGateway.server = this.server;
  }
  
  async handleConnection(@ConnectedSocket() user: ValidSocket): Promise<void> {
    
    user.name = user.handshake.query.name as string;
    const validUser = await this.websocketService.validateJWT(
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

  
  @SubscribeMessage('handshake')
  async handleHandshake(@ConnectedSocket() client: ValidSocket) {
      console.info(
        `User ${client.name} | Connected to Gateway | wsID: ${client.id}`,
      );
      const user = await this.userService.findUserByUsername(client.name);
      const userDto = this.userService.userToDto(user);
      this.websocketService.serverMessage('reconnect', [client.id], {user: userDto});
  }
}
