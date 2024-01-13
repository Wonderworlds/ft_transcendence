import { Socket } from 'socket.io';

export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  DnD = 'Do Not Disturb',
  Busy = 'Busy',
}

export enum ChatMessageType {
  STANDARD = 'STANDARD',
  PRIVATE = 'PRIVATE',
  COMMAND = 'COMMAND',
  BOT = 'BOT',
  SERVER = 'SERVER',
  UNDEFINED = 'UNDEFINED',
  PROFILE = 'PROFILE',
}

export type Success = {
  success: boolean;
};

export type ValidSocket = Socket & {
  name: string;
};

export enum lobbyProtection {
  public = 'Public',
  private = 'Private',
  protected = 'Protected',
}

export enum EventGame {
	UP = 'UP',
	DOWN = 'DOWN',
	ARROW_UP = 'ARROW_UP',
	ARROW_DOWN = 'ARROW_DOWN',
	W_KEY = 'W_KEY',
	S_KEY = 'S_KEY',
  START_MATCH = 'START_MATCH',
  START_TOURNAMENT = 'START_TOURNAMENT',
  PAUSE = 'PAUSE',
  NEXT = 'NEXT',
}


export type Pos = {
  x: number;
  y: number;
};

export type UserJwt = {
  userId: number;
  username: string;
}

export enum GameType {
	classicLocal = 'Local classic',
	tournamentLocal = 'Local Tournament',
	classicOnline = 'Online classic',
	multiplayerOnline = 'Online multiplayer',
	tournamentOnline = 'Online Tournament',
}
