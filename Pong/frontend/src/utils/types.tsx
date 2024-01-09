export enum GameType {
	classic = 'classic',
	multiplayer = 'multiplayer',
	tournament = 'Tournament',
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

export type User = {
	pseudo: string;
	ppImg: string;
	status: Status;
};

export type Msg = {
	pseudo: string;
	text: string;
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
	Null = '',
	History = 'matchHistory',
	Achievement = 'achievement',
	Friend = 'friend',
	Leaderboard = 'leaderboard',
}

export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	DnD = 'Do Not Disturb',
	Busy = 'Busy',
}

export enum EventGame {
	UP = 'UP',
	DOWN = 'DOWN',
	ARROW_UP = 'ARROW_UP',
	ARROW_DOWN = 'ARROW_DOWN',
	W_KEY = 'W_KEY',
	S_KEY = 'S_KEY',
	SPACE_KEY = 'SPACE',
}
