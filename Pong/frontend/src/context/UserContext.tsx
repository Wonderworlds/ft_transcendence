import { AxiosError } from 'axios';
import { Status } from 'backend/shared/src/types';
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDto } from '../utils/dtos';
import { Pages } from '../utils/types';
import { getAxios } from './AxiosContext';

type UserContextType = {
	username: string;
	setUsername: React.Dispatch<React.SetStateAction<string>>;
	pseudo: string;
	setPseudo: React.Dispatch<React.SetStateAction<string>>;
	ppImg: string;
	setppImg: React.Dispatch<React.SetStateAction<string>>;
	ppSrc: string;
	setPPSrc: React.Dispatch<React.SetStateAction<string>>;
	email: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	doubleAuth: boolean;
	setDoubleAuth: React.Dispatch<React.SetStateAction<boolean>>;
	status: Status;
	setStatus: React.Dispatch<React.SetStateAction<Status>>;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const axios = getAxios();
	const navigate = useNavigate();
	const [username, setUsername] = React.useState<string>('');
	const [pseudo, setPseudo] = React.useState<string>('');
	const [email, setEmail] = React.useState<string>('');
	const [ppImg, setppImg] = React.useState<string>('');
	const [ppSrc, setPPSrc] = React.useState<string>('');
	const [status, setStatus] = React.useState<Status>(Status.Offline);
	const [doubleAuth, setDoubleAuth] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (axios.ready) {
			axios.client
				.get('users')
				.then((res) => {
					updateUser(res.data);
					navigate(Pages.Home);
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
	useEffect(() => {
		console.log(process.cwd());
	}, [ppImg]);
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
				ppSrc,
				setppImg,
				setPPSrc,
				doubleAuth,
				setDoubleAuth,
				status,
				setStatus,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function getUser() {
	return useContext(UserContext);
}
