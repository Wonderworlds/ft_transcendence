import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
		origin: [process.env.FRONT_URL],
	}})
export class PrincipalGateway {

  @WebSocketServer()
  server: Server;

  
}
