import { Socket } from "socket.io";
import { UserDto } from "./dtos";

export type ValidSocket = Socket & {
	name: string;
}

export enum roomProtection {
	public = "Public",
	private = "Private",
	protected = "Protected",
}

export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	DnD = 'Do Not Disturb',
}

export enum eventGame {
	UP = 'UP',
	DOWN = 'DOWN',
}
