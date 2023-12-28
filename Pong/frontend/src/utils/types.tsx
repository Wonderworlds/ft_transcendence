export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	DnD = 'Do Not Disturb',
}

export type User = {
	pseudo: string;
	ppImg: string;
	status: Status;
};
