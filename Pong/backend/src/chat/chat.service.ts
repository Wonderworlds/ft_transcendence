import { Injectable } from '@nestjs/common';
import { SubscribeMessage } from '@nestjs/websockets';

@Injectable()
export class ChatService {

	@SubscribeMessage('message')
	onMessage(client, data: string): void {
	}
}
