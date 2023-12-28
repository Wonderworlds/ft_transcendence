import { ValidSocket } from "src/utils/types";
import { WebsocketService } from "src/websocket/websocket.service";
import { v4 as uuidv4 } from 'uuid';

export class Pong {
	id:string ;
	constructor (
		p1: ValidSocket,
		p2: ValidSocket
	) {
		this.id = uuidv4();
		console.log(this.id);
	}
}