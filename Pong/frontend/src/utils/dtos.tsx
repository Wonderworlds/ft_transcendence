import { EventGame, GameType, Pos, Status } from './types';

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
	won: boolean;
	gameType: GameType;
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

export type lobbyIDDto = {
	lobby: string;
};

export type inputDto = {
	input: EventGame;
};

export type CodeDto = {
	password: string;
};

export type TwoFADto = {
	code: string;
};

export type inputLobbyDto = {
	input: EventGame;
	lobby: string;
};

export type Success = {
	success: boolean;
};

export type LobbyDto = {
	id: string;
	owner: string;
	gameType: GameType;
	nbPlayers: number;
	maxPlayers: number;
	status: 'waiting' | 'playing';
};
