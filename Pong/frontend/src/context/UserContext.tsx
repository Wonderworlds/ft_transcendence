import React, { createContext, useContext } from 'react';
import { Status } from '../utils/types';
import { UserDto } from '../utils/dtos';
import { getAxios } from './AxiosContext';

type UserContextType = {
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	pseudo: string;
	setPseudo: React.Dispatch<React.SetStateAction<string>>;
	ppImg: string;
	setppImg: React.Dispatch<React.SetStateAction<string>>;
	doubleAuth: boolean;
	setDoubleAuth: React.Dispatch<React.SetStateAction<boolean>>;
	status: Status;
	setStatus: React.Dispatch<React.SetStateAction<Status>>;
	loggedIn: boolean;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
	userAsDto: () => UserDto;
	updateUser: (body: UserDto) => void;
	createUser: (body: UserDto) => void;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const client = getAxios().client;
	const [username, setUsername] = React.useState<string>('');
	const [pseudo, setPseudo] = React.useState<string>('');
	const [ppImg, setppImg] = React.useState<string>('pp_default.png');
	const [status, setStatus] = React.useState<Status>(Status.Offline);
	const [doubleAuth, setDoubleAuth] = React.useState<boolean>(false);
	const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

	function userAsDto() {
		const userDto: UserDto = {
			username: username,
			pseudo: pseudo,
			ppImg: ppImg,
			twoFA: doubleAuth,
			status: status,
		};
		return userDto;
	}

	React.useEffect(() => {
		if (username) {
			client.put(`/users/${username}`, userAsDto());
		}
	}, [pseudo, ppImg, status, doubleAuth]);

	function updateUser(body: UserDto) {
		if (username != body.username) setUsername(body.username);
		if (pseudo != body.pseudo) setPseudo(body.pseudo);
		if (ppImg != body.ppImg) setppImg(body.ppImg);
		if (status != body.status) setStatus(body.status);
		if (body.twoFA && doubleAuth != body.twoFA) setDoubleAuth(body.twoFA);
	}

	async function createUser(body: UserDto) {
		let found = true;
		await client.get(`/users/${body.username}`).then((res) => {
			if (!res.data) found = false;
			else updateUser(res.data);
		});
		if (!found) {
			body.pseudo = body.username;
			await client.post('/users', body).catch(() => {
				return;
			});
			updateUser(body);
		}
		setLoggedIn(true);
	}

	return (
		<UserContext.Provider
			value={{
				username,
				setUsername,
				pseudo,
				setPseudo,
				ppImg,
				setppImg,
				doubleAuth,
				setDoubleAuth,
				status,
				setStatus,
				loggedIn,
				setLoggedIn,
				userAsDto,
				updateUser,
				createUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function getUser() {
	return useContext(UserContext);
}
