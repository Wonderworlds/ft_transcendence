import axios, { AxiosInstance } from 'axios';
import React, { createContext, useContext } from 'react';

type AxiosContextType = {
	client: AxiosInstance;
	auth: { token: string; username: string };
	setAuth: React.Dispatch<React.SetStateAction<{ token: string; username: string }>>;
	ready: boolean;
	setReady: React.Dispatch<React.SetStateAction<boolean>>;
};

export const axiosContext = createContext({} as AxiosContextType);

export const AxiosContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [auth, setAuth] = React.useState<{ token: string; username: string }>({
		token: '',
		username: '',
	});
	const [ready, setReady] = React.useState<boolean>(false);

	let client = axios.create({
		baseURL: import.meta.env.VITE_BURL,
	});

	React.useEffect(() => {
		if (auth.token) {
			axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
			setReady(true);
			sessionStorage.setItem('username', auth.username);
			sessionStorage.setItem('JWTtoken', auth.token);
			console.log('AxiosContext: Authenticated');
		} else setReady(false);
	}, [auth]);

	React.useEffect(() => {
		const username = sessionStorage.getItem('username');
		const token = sessionStorage.getItem('JWTtoken');
		if (username && token) setAuth({ token: token, username: username });
	}, []);
	return (
		<axiosContext.Provider value={{ client, auth, setAuth, ready, setReady }}>
			{children}
		</axiosContext.Provider>
	);
};

export function getAxios() {
	return useContext(axiosContext);
}
