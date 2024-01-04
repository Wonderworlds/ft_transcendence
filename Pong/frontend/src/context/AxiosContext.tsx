import axios, { AxiosInstance } from 'axios';
import React from 'react';
import { createContext, useContext } from 'react';

type AxiosContextType = {
	client: AxiosInstance;
	auth: { token: string; username: string };
	setAuth: React.Dispatch<React.SetStateAction<{ token: string; username: string }>>;
	ready: Boolean;
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
		} else setReady(false);
	}, [auth]);

	return (
		<axiosContext.Provider value={{ client, auth, setAuth, ready }}>
			{children}
		</axiosContext.Provider>
	);
};

export function getAxios() {
	return useContext(axiosContext);
}
