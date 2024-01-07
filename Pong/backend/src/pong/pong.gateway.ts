import { Body } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { inputRoomDto, roomDto } from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';
import { AGateway } from 'src/websocket/Agateway';
import { WebsocketService } from 'src/websocket/websocket.service';
import { Pong } from './Pong';

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class PongGateway extends AGateway {
  protected listGame: Map<string, Pong> = new Map<string, Pong>();

  @SubscribeMessage('searchGame')
  subscribeSearch(
    @ConnectedSocket() client: ValidSocket
  ) {
    console.info("searchGame");
    // const id = uuidv4();
    // this.server.to(client.id).emit('ready', { room: id });
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
