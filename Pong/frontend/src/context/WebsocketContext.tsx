import { createContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
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

	const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
	const socket = io(urlName);
	return (
		<PrincipalWebsocketContext.Provider value={{ socket }}>
			{children}
		</PrincipalWebsocketContext.Provider>
	);
};
