import { Socket } from "socket.io";

export type User = {
	id?: number;
	name: string;
}

export type ValidSocket = Socket & {
	name: string;
}

export enum roomProtection  {
	public = "public",
	private = "private",
	protected = "protected"
}

export enum LadderType  {
	gold = "Gold",
	silver = "Silver",
	bronze = "Bronze"
}