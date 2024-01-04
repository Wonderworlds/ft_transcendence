import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAxios } from './AxiosContext';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
};

export const WebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	const axios = getAxios();
	const socket = io(`${import.meta.env.VITE_BURL}/pong`, {
		query: { name: axios.auth.username },
		reconnection: true,
		reconnectionDelayMax: 5000,
		reconnectionDelay: 1000,
	});

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connect Pong');
		});
		socket.on('disconnect', () => {
			console.log('disconnect Pong');
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
		};
	}, []);

	return <WebsocketContext.Provider value={{ socket }}>{children}</WebsocketContext.Provider>;
};

export function getSocket() {
	return useContext(WebsocketContext);
}
