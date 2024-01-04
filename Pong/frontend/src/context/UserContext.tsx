import React, { createContext, useContext } from 'react';
import { Status } from '../utils/types';
import { getAxios } from './AxiosContext';
import { AxiosError } from 'axios';
import { UserDto } from '../utils/dtos';

type UserContextType = {
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	pseudo: string;
	setPseudo: React.Dispatch<React.SetStateAction<string>>;
	ppImg: string;
	setppImg: React.Dispatch<React.SetStateAction<string>>;
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	doubleAuth: boolean;
	setDoubleAuth: React.Dispatch<React.SetStateAction<boolean>>;
	status: Status;
	setStatus: React.Dispatch<React.SetStateAction<Status>>;
	loggedIn: boolean;
	setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const axios = getAxios();
	const [username, setUsername] = React.useState<string>('');
	const [pseudo, setPseudo] = React.useState<string>('');
	const [email, setEmail] = React.useState<string>('');
	const [ppImg, setppImg] = React.useState<string>('');
	const [status, setStatus] = React.useState<Status>(Status.Offline);
	const [doubleAuth, setDoubleAuth] = React.useState<boolean>(false);
	const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (axios.ready) {
			axios.client
				.get('users')
				.then((res) => {
					updateUser(res.data);
					setLoggedIn(true);
				})
				.catch((err: AxiosError) => console.log(err));
		}
	}, [axios.ready]);

	function updateUser(body: UserDto) {
		console.log('updateUser');
		if (username != body.username) setUsername(body.username);
		if (pseudo != body.pseudo) setPseudo(body.pseudo);
		if (ppImg != body.ppImg) setppImg(body.ppImg);
		if (status != body.status) setStatus(body.status);
		if (body.twoFA && doubleAuth != body.twoFA) setDoubleAuth(body.twoFA);
		if (body.email && email != body.email) setEmail(body.email);
	}

	return (
		<UserContext.Provider
			value={{
				username,
				setUsername,
				pseudo,
				setPseudo,
				email,
				setEmail,
				ppImg,
				setppImg,
				doubleAuth,
				setDoubleAuth,
				status,
				setStatus,
				loggedIn,
				setLoggedIn,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function getUser() {
	return useContext(UserContext);
}
