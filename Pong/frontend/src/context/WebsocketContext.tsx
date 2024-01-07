import React, { createContext, useContext, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAxios } from './AxiosContext';

type WebSocketContextType = {
	socket: Socket;
	room: string;
	setRoom: React.Dispatch<React.SetStateAction<string>>;
};

export const WebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	const axios = getAxios();
	const [room, setRoom] = useState<string>('');
	const url = `${import.meta.env.VITE_BURL}`;
	const [socket, setSocket] = useState<any>();

	React.useEffect(() => {
		if (socket) {
			socket.on('connect', () => {
				console.log('connect');
				socket.emit('handshake');
			});
			socket.on('reconnect', () => {
				console.log('connect');
			});
			socket.on('disconnect', () => {
				console.log('disconnect');
			});
		}
		return () => {
			if (socket) {
				socket.off('connect');
				socket.off('disconnect');
			}
		};
	}, [socket]);

	React.useEffect(() => {
		if (axios.ready) {
			const socketOptions = {
				query: {
					name: axios.auth.username,
					Authorization: axios.auth.token, // 'Bearer h93t4293t49jt34j9rferek...'
				},
				reconnectionDelayMax: 10000,
			};
			setSocket(io(url, socketOptions));
		}
	}, [axios.ready]);

	return (
		<WebsocketContext.Provider value={{ socket, room, setRoom }}>
			{children}
		</WebsocketContext.Provider>
	);
};

export function getSocket() {
	return useContext(WebsocketContext);
}
