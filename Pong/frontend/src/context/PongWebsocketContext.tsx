import { createContext, useContext, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';
import { getUser } from './UserContext';

type PongSocketContextType = {
	socket: Socket;
};

const PongWebsocketContext = createContext({} as PongSocketContextType);

export const PongWebsocketProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const user = getUser();
	const urlName = `${import.meta.env.VITE_BURL}/pong?name=${user.username}`;
	const socket = io(urlName);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('connect pong');
		});
		return () => {
			socket.off('connect');
		};
	}, []);

	return (
		<PongWebsocketContext.Provider value={{ socket }}>
			{children}
		</PongWebsocketContext.Provider>
	);
};

export function getPongSocket() {
	return useContext(PongWebsocketContext);
}
