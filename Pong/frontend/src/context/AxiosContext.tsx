import axios, { AxiosInstance } from 'axios';
import { createContext, useContext } from 'react';

type AxiosContextType = {
	client: AxiosInstance;
};

export const axiosContext = createContext({} as AxiosContextType);

export const AxiosContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const client = axios.create({
		baseURL: import.meta.env.VITE_BURL,
	});
	return (
		<axiosContext.Provider value={{ client }}>{children}</axiosContext.Provider>
	);
};

export function getAxios() {
	return useContext(axiosContext);
}
