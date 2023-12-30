import { Status } from "./types";

export type UserDto = {
	username: string;
	pseudo: string;
	ppImg: string;
	password?: string;
	twoFA?: boolean;
	status: Status;
}