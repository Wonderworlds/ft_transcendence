export class UserDto {
	username: string;
}

export enum Status {
	Online = 'Online',
	Offline = 'Offline',
	DnD = 'Do Not Disturb',
}

export type UserFront = {
	pseudo: string;
	ppImg: string;
	status: Status;
};