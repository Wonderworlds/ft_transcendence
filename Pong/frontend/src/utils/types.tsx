export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	DnD = 'Do Not Disturb',
}

export type Match = {
	me: User;
	adversary: User;
	myScore: number;
	adversaryScore: number;
};

export type User = {
	pseudo: string;
	ppImg: string;
	status: Status;
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

export enum eventGame {
	UP = 'UP',
	DOWN = 'DOWN',
}
