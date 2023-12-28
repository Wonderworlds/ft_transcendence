import { Socket } from "socket.io";

export type User = {
	id?: number;
	name: string;
}

export type ValidSocket = Socket & {
	name: string;
}