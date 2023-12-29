import React, { createContext, useContext } from 'react';
import { Status, User } from '../utils/types';

export type DoubleAuth = {
	doubleAuth: boolean;
};

export type UStatus = {
	status: Status;
};

export type Pseudo = {
	pseudo: string;
};

export type PPImg = {
	ppImg: string;
};

export type Email = {
	email: string;
};

type UserContextType = {
	pseudo: Pseudo;
	setPseudo: React.Dispatch<React.SetStateAction<Pseudo>>;
	ppImg: PPImg;
	setppImg: React.Dispatch<React.SetStateAction<PPImg>>;
	doubleAuth: DoubleAuth;
	setDoubleAuth: React.Dispatch<React.SetStateAction<DoubleAuth>>;
	status: UStatus;
	setStatus: React.Dispatch<React.SetStateAction<UStatus>>;
	updateUserContext: (res: User) => void;
};

export const UserContext = createContext({} as UserContextType);

export const UserContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [pseudo, setPseudo] = React.useState<Pseudo>({ pseudo: '' });
	const [ppImg, setppImg] = React.useState<PPImg>({ ppImg: '' });
	const [status, setStatus] = React.useState<UStatus>({
		status: Status.Offline,
	});
	const [doubleAuth, setDoubleAuth] = React.useState<DoubleAuth>({
		doubleAuth: false,
	});

	function updateUserContext(res: User) {
		setPseudo({ pseudo: res.pseudo });
		setppImg({ ppImg: res.ppImg });
		// setDoubleAuth({ doubleAuth: res.doubleAuth });
		setStatus({ status: res.status });
	}
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
				updateUserContext,
			}}
		>
			{children};
		</UserContext.Provider>
	);
};

export function getUser() {
	console.log('getUser');
	console.log(useContext(UserContext));
	return useContext(UserContext);
}
