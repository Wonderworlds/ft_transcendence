export enum GameType {
	classicLocal = 'Local classic',
	multiplayerLocal = 'Local multiplayer',
	tournamentLocal = 'Local Tournament',
	classicOnline = 'Online classic',
	multiplayerOnline = 'Online multiplayer',
	tournamentOnline = 'Online Tournament',
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

export type Match = {
	me: User;
	adversary: User;
	myScore: number;
	adversaryScore: number;
};

export type Pos = {
	x: number;
	y: number;
};

export type TypeMatch = {
	type: string;
	player: number;
	tournament: number;
};

export type User = {
	pseudo: string;
	ppImg: string;
	status: Status;
};

export type Msg = {
	pseudo: string;
	text: string;
	type: number;
};

export enum Pages {
	Root = '/',
	Home = '/home',
	WaitingMatch = '/game',
	Pong = '/pong',
	Stats = '/stats',
	Settings = '/settings',
	Default = '/*',
}

export enum TabOption {
	Friend = 'Friends',
	History = 'MatchHistory',
}

export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	Busy = 'Busy',
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
