import { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
	disconnect: () => void;
};

export const PongWebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const urlName = `${import.meta.env.VITE_BURL}/pong?name=${getUser().pseudo}`;
	const socket = io(urlName);

	function disconnect(): void {
		socket.disconnect();
	}
	return (
		<PongWebsocketContext.Provider value={{ socket, disconnect }}>
			{children}
		</PongWebsocketContext.Provider>
	);
};

export function getPongSocket() {
	return useContext(PongWebsocketContext);
}
