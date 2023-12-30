import { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

// const urlName = `${import.meta.env.VITE_BURL}?name=${getUser().pseudo}`;
type WebSocketContextType = {
	socket: Socket;
	disconnect: () => void;
};

export const ChatWebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const urlName = `${import.meta.env.VITE_BURL}/chat?name=${getUser().pseudo}`;
	const socket = io(urlName);

	function disconnect(): void {
		socket.disconnect();
	}
	return (
		<ChatWebsocketContext.Provider value={{ socket, disconnect }}>
			{children}
		</ChatWebsocketContext.Provider>
	);
};

export function getChatSocket() {
	return useContext(ChatWebsocketContext);
}
