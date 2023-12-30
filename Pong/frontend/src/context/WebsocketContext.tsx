import React, { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';
import { UserDto } from '../utils/dtos';

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
	const url = `${import.meta.env.VITE_BURL}?name=${user.username}`;
	const socket = io(url);

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('connect');
			socket.emit('login', user.userAsDto());
		});
		socket.on('disconnect', () => {
			console.log('disconnect');
			user.setLoggedIn(false);
		});

		socket.on('onUpdateUser', (updatedUser: UserDto) => {
			console.log('onUpdatedUser');
			user.updateUser(updatedUser);
		});

		return () => {
			socket.off('connect');
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
