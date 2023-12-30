import React, { createContext, useContext } from 'react';
import { Status } from '../utils/types';

type UserContextType = {
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
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [pseudo, setPseudo] = React.useState<string>('');
	const [ppImg, setppImg] = React.useState<string>('pp_default.png');
	const [status, setStatus] = React.useState<Status>(Status.Offline);
	const [doubleAuth, setDoubleAuth] = React.useState<boolean>(false);
	const [loggedIn, setLoggedIn] = React.useState<boolean>(false);

	return (
		<UserContext.Provider
			value={{
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
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export function getUser() {
	return useContext(UserContext);
}
