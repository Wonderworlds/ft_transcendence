import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
	disconnect: () => void;
};

export const PrincipalWebsocketContext = createContext(
	{} as WebSocketContextType
);

export const WebsocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	console.log('websocket');
	const user = getUser();
	const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
	const socket = io(urlName);

	React.useEffect(() => {
		socket.on('disconnect', () => {
			console.log('disconnect');
			user.setLoggedIn(false);
		});

		return () => {
			socket.off('disconnect');
		};
	}, []);

	function disconnect(): void {
		socket.disconnect();
	}
	return (
		<PrincipalWebsocketContext.Provider value={{ socket, disconnect }}>
			{children}
		</PrincipalWebsocketContext.Provider>
	);
};

export function getSocket() {
	return useContext(PrincipalWebsocketContext);
}
