import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getAxios } from './AxiosContext';

type GameSocketContextType = {
	socket: Socket;
};

export const GameSocketContext = createContext({} as GameSocketContextType);

export const GameSocketProvider = ({ children }: { children: React.ReactNode }) => {
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

	return <GameSocketContext.Provider value={{ socket }}>{children}</GameSocketContext.Provider>;
};

export function getGameSocket() {
	return useContext(GameSocketContext);
}
