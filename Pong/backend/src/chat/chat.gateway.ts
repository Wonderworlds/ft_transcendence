import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { messageLobbyDto } from 'src/utils/Dtos';
import { ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';
import { ChatMessageType, ChatService } from './chat.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: [process.env.FRONT_URL],
  },
})
export class ChatGateway{

  constructor(public websocketService: WebsocketService, public chatService: ChatService) {
    console.info('ChatGateway');
  }

  @SubscribeMessage('messageChat')
  handleMessage(@ConnectedSocket() client: ValidSocket, @Body() payload: messageLobbyDto) {
    const typeMessage = this.chatService.getMessageType(payload.message);
    if (!this.chatService.isClientInLobby(client, payload.lobby)) return this.websocketService.serverError([client.id], 'you are not in this lobby');
    switch (typeMessage) {
      case ChatMessageType.STANDARD: return this.chatService.sendMessageRoom(client, payload);
      case ChatMessageType.PRIVATE: return this.chatService.sendPrivateMessage(client, payload);
      case ChatMessageType.COMMAND:
      case ChatMessageType.BOT:
      case ChatMessageType.UNDEFINED:
    }
    
  }
}
