import { Status } from "./types";

export type UserDto = {
	username: string;
	pseudo: string;
	ppImg: string;
	twoFA?: boolean;
	status: Status;
}

export type MatchDto ={
	scoreP1: number;
	scoreP2: number;
	P1: string;
	P2: string;
}