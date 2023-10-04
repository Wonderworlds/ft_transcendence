export type CreateUserParams = {
	username: string;
	password: string;
}

export type UserPostParams = {
	title: string;
	description: string;
}

export type UpdateUserParams = {
	username: string;
	password: string;
}

export type UserProfileParams = {
	firstname: string;
	lastname: string;
	age: number;
	dob: string;
}