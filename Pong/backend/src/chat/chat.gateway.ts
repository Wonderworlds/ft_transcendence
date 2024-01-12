import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MatchDto } from 'src/utils/Dtos';
import { WebsocketService } from 'src/websocket/websocket.service';
import { ChatService } from './chat.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class ChatGateway {

  constructor(private readonly chatService: ChatService, public websocketService: WebsocketService) {
    console.info('ChatGateway');
  }

  @SubscribeMessage('messageChat')
  handleMessage(@ConnectedSocket() client: Socket, @Body() payload: MatchDto) {
    console.info( 'Hello world!');
    this.websocketService.server.emit('liveChat', "test");
  }
}
