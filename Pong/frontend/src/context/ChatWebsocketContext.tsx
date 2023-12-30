import { createContext, useContext } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

type ChatSocketContextType = {
	socket: Socket;
};

const ChatWebsocketContext = createContext({} as ChatSocketContextType);

export const ChatWebsocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const user = getUser();
	const urlName = `${import.meta.env.VITE_BURL}/chat?name=${user.username}`;
	const socket = io(urlName);

	return (
		<ChatWebsocketContext.Provider value={{ socket }}>
			{children}
		</ChatWebsocketContext.Provider>
	);
};

export function getChatSocket() {
	return useContext(ChatWebsocketContext);
}
