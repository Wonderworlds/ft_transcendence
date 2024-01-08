import { Pos, Status, eventGame } from './types';

export type UserDto = {
	username: string;
	pseudo: string;
	ppImg: string;
	twoFA?: boolean;
	email?: string;
	status: Status;
};

export type MatchDto = {
	scoreP1: number;
	scoreP2: number;
	P1: string;
	P2: string;
};

export type AuthDto = {
	access_token: string;
	username: string;
	twoFA: boolean;
};

export type UpdateGameDto = {
	ball: Pos;
	pLeft: Pos;
	pRight: Pos;
	scorePLeft: number;
	scorePRight: number;
};

export type roomDto = {
	room: string;
};

export type inputDto = {
	input: eventGame;
};

export type CodeDto = {
	password: string;
};

export type TwoFADto = {
	code: string;
};

export type inputRoomDto = {
	input: eventGame;
	room: string;
};

export type Success = {
	success: boolean;
};
