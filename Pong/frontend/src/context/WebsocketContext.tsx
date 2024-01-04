import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
};

export const WebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	const socket = io(import.meta.env.VITE_BURL);

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connect');
			return;
		});
		socket.on('disconnect', () => {
			console.log('disconnect');
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
