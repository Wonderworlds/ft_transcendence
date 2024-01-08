import { Body } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { inputRoomDto, roomDto } from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';
import { AGateway } from 'src/websocket/Agateway';
import { Pong } from './Pong';

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class PongGateway extends AGateway {
  protected listGame: Map<string, Pong> = new Map<string, Pong>();

  
 isClientPlaying(@ConnectedSocket() client: ValidSocket)
{
  let gameId = "";
}

  @SubscribeMessage('searchGame')
  subscribeSearch(
    @ConnectedSocket() client: ValidSocket
  ) {
    console.info("searchGame");
    // const id = uuidv4();
    // this.server.to(client.id).emit('ready', { room: id });
  }

  
  @SubscribeMessage('cancelSearch')
  cancelSearch(
    @ConnectedSocket() client: ValidSocket
  ) {
    console.info("cancelSearch");
  }

  @SubscribeMessage('input')
  onInputReceived(
    @ConnectedSocket() client: ValidSocket,
    @Body() body: inputRoomDto,
  ) {
    this.listGame.get(body.room).onInput(client, body.input);
  }

  @SubscribeMessage('start')
  onStart(@ConnectedSocket() client: ValidSocket, @Body() body: roomDto) {
    client.join(body.room);
    const game = new Pong(
      body.room,
      this.server,
      client,
    );
    this.listGame.set(body.room, game);
  }
}
