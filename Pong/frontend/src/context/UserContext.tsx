import React, { createContext, useContext } from 'react';
import { UserDto } from '../utils/dtos';
import { Status } from '../utils/types';

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
	user: UserDto;
	setUser: React.Dispatch<React.SetStateAction<UserDto>>;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [username, setUsername] = React.useState<string>('');
	const [pseudo, setPseudo] = React.useState<string>('');
	const [email, setEmail] = React.useState<string>('');
	const [ppImg, setppImg] = React.useState<string>('');
	const [ppSrc, setPPSrc] = React.useState<string>('');
	const [user, setUser] = React.useState<UserDto>({} as UserDto);
	const [status, setStatus] = React.useState<Status>(Status.Offline);
	const [doubleAuth, setDoubleAuth] = React.useState<boolean>(false);
	const pathToImng = import.meta.env.VITE_BURL;

	// React.useEffect(() => {
	// 	if (axios.ready) {
	// 		axios.client
	// 			.get('me')
	// 			.then((res) => {
	// 				updateUser(res.data);
	// 			})
	// 			.catch((err: AxiosError) => console.log(err));
	// 	}
	// }, [axios.ready]);

	React.useEffect(() => {
		if (user) {
			updateUser(user);
		}
	}, [user]);

	React.useEffect(() => {
		if (ppSrc) setppImg(`${pathToImng}/public/${ppSrc}`);
	}, [ppSrc]);

	function updateUser(body: UserDto) {
		if (username != body.username) setUsername(body.username);
		if (pseudo != body.pseudo) setPseudo(body.pseudo);
		if (ppSrc != body.ppImg) setPPSrc(body.ppImg);
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
				ppSrc,
				setppImg,
				setPPSrc,
				doubleAuth,
				setDoubleAuth,
				status,
				setStatus,
				user,
				setUser,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function getUser() {
	return useContext(UserContext);
}
