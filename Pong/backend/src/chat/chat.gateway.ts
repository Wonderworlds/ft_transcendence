import { Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { messageLobbyDto } from 'src/utils/Dtos';
import { ChatMessageType, ValidSocket } from 'src/utils/types';
import { WebsocketService } from 'src/websocket/websocket.service';
import { ChatService } from './chat.service';

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
    if (payload.message.length > 120) return this.websocketService.serverError([client.id], 'message too long > 120');
    const typeMessage = this.chatService.getMessageType(payload.message);
    if (!this.chatService.isClientInLobby(client, payload.lobby)) return this.websocketService.serverError([client.id], 'you are not in this lobby');
    switch (typeMessage) {
      case ChatMessageType.STANDARD: return this.chatService.sendMessageRoom(client, payload);
      case ChatMessageType.PRIVATE: return this.chatService.sendPrivateMessage(client, payload);
      case ChatMessageType.COMMAND: return this.chatService.sendCommandMessage(client, payload);
    }
  }

  
  @SubscribeMessage('messageChatTest')
  handleMessageTest(@ConnectedSocket() client: ValidSocket, @Body() payload: string) {
    client.join('lobby1');

    const newpayload = {message: payload, lobby: 'lobby1'};
    if (newpayload.message.length > 120) return this.websocketService.serverError([client.id], 'message too long > 120');
    const typeMessage = this.chatService.getMessageType(newpayload.message);
    switch (typeMessage) {
      case ChatMessageType.STANDARD: return this.chatService.sendMessageRoom(client, newpayload);
      case ChatMessageType.PRIVATE: return this.chatService.sendPrivateMessage(client, newpayload);
      case ChatMessageType.COMMAND: return this.chatService.sendCommandMessage(client, newpayload);
    }
  }
}
