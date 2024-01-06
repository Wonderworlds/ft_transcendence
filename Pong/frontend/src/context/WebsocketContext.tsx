import React, { createContext, useContext, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

type WebSocketContextType = {
	socket: Socket;
	room: string;
	setRoom: React.Dispatch<React.SetStateAction<string>>;
};

export const WebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	const user = getUser();
	const [room, setRoom] = useState<string>('');
	const url = `${import.meta.env.VITE_BURL}/pong?name=${user.pseudo}`;
	const socket = io(url);

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connect');
		});
		socket.on('disconnect', () => {
			console.log('disconnect');
		});

		socket.on('ready', (res) => {
			setRoom(res.room);
		});
		return () => {
			socket.off('connect');
			socket.off('ready');
			socket.off('disconnect');
		};
	}, []);

	return (
		<WebsocketContext.Provider value={{ socket, room, setRoom }}>
			{children}
		</WebsocketContext.Provider>
	);
};

export function getSocket() {
	return useContext(WebsocketContext);
}
