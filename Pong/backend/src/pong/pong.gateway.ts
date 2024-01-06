import { Body } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { AGateway } from 'src/websocket/Agateway';
import { WebsocketService } from 'src/websocket/websocket.service';
import { v4 as uuidv4 } from 'uuid';
import { Pong } from './Pong';
import { inputRoomDto, roomDto } from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
  namespace: '/pong',
})
export class PongGateway extends AGateway {
  protected listGame: Map<string, Pong> = new Map<string, Pong>();

  override async handleConnection(user: ValidSocket): Promise<void> {
    user.name = user.handshake.query.name as string;
    console.info(
      `User ${user.name} | Connected to PongGateway | wsID: ${user.id}`,
    );
    const id = uuidv4();
    this.server.to(user.id).emit('ready', { room: id });
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: inputRoomDto,
  ) {
    console.info('body', body);
    this.listGame.get(body.room).onInput(client, body.input);
  }

  @SubscribeMessage('start')
  onStart(@ConnectedSocket() client: ValidSocket, @Body() body: roomDto) {
    client.join(body.room);
    const game = new Pong(
      client,
      this.server,
      new WebsocketService(),
      body.room,
    );
    this.listGame.set(body.room, game);
  }
}
