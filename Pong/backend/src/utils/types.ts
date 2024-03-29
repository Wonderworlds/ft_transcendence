import { Socket } from 'socket.io';

export enum Status {
  Online = 'Online',
  Offline = 'Offline',
  DnD = 'Do Not Disturb',
  Busy = 'Busy',
}
export type FriendGameDto = {
  lobby: string;
  sender: string;
}
export enum ChatMessageType {
  STANDARD = 'STANDARD',
  PRIVATE = 'PRIVATE',
  COMMAND = 'COMMAND',
  BOT = 'BOT',
  SERVER = 'SERVER',
  UNDEFINED = 'UNDEFINED',
  PROFILE = 'PROFILE',
  DEMAND = 'DEMAND',
  INVITE = 'INVITE',
}

export type Success = {
  success: boolean;
};

export type ValidSocket = Socket & {
  name: string;
  lobby: string;
};

export enum lobbyProtection {
  public = 'Public',
  private = 'Private',
  protected = 'Protected',
}

export enum EventGame {
	UP = 'UP',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
	DOWN = 'DOWN',
	ARROW_UP = 'ARROW_UP',
	ARROW_DOWN = 'ARROW_DOWN',
  ARROW_LEFT = 'ARROW_LEFT',
  ARROW_RIGHT = 'ARROW_RIGHT',
	W_KEY = 'W_KEY',
	S_KEY = 'S_KEY',
  A_KEY = 'A_KEY',
  D_KEY = 'D_KEY',
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
	multiplayerLocal = 'Local multiplayer',
	tournamentLocal = 'Local Tournament',
	classicOnline = 'Online classic',
	multiplayerOnline = 'Online multiplayer',
	tournamentOnline = 'Online Tournament',
}
