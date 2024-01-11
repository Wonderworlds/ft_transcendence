import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { UserDto } from '../utils/dtos';
import { Pages } from '../utils/types';
import { getAxios } from './AxiosContext';
import { getUser } from './UserContext';
type WebSocketContextType = {
	socket: Socket;
	lobby: string;
	setLobby: React.Dispatch<React.SetStateAction<string>>;
};

export const WebsocketContext = createContext({} as WebSocketContextType);

export const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	const axios = getAxios();
	const user = getUser();
	const navigate = useNavigate();
	const [lobby, setLobby] = useState<string>('');
	const url = `${import.meta.env.VITE_BURL}`;
	const [socket, setSocket] = useState<Socket>();

	React.useEffect(() => {
		if (socket) {
			socket.on('connect', () => {
				console.log('connect');
				socket.emit('handshake');
			});
			socket.on('reconnect', (response: { user: UserDto }) => {
				console.log(response);
				user.setUser(response.user);
			});
			socket.on('disconnect', () => {
				console.log('disconnect');
			});

			socket.on('error', (error: any) => {
				console.log(error);
				alert(error);
			});

			socket.on(
				'friendGame',
				(response: { message?: string; lobby: string; sender: string; accept?: boolean }) => {
					if (response.message) {
						if (confirm(`${response.sender}: ${response.message}`)) {
							setLobby(response.lobby);
							navigate(Pages.Pong);
							socket.emit('responseFriendGame', { lobby: response.lobby, accept: true });
						} else {
							socket.emit('responseFriendGame', { lobby: response.lobby, accept: false });
						}
					} else if (response.accept) {
						setLobby(response.lobby);
						navigate(Pages.Pong);
					} else {
						alert('Game declined');
					}
				}
			);
		}
		return () => {
			if (socket) {
				socket.off('connect');
				socket.off('error');
				socket.off('disconnect');
				socket.off('friendGame');
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
		<WebsocketContext.Provider value={{ socket: socket!, lobby, setLobby }}>
			{children}
		</WebsocketContext.Provider>
	);
};

export function getSocket() {
	return useContext(WebsocketContext);
}
