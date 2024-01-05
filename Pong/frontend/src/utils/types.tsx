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
	Root = 'root',
	Home = 'Home',
	WaitingMatch = 'WaitingMatch',
	Profile = 'Profile',
	Parameter = 'Parameter',
	Chat = 'Chat',
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
	ARROW_UP = 'ARROW_UP',
	ARROW_DOWN = 'ARROW_DOWN',
	W_KEY = 'W_KEY',
	S_KEY = 'S_KEY',
}
