import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { LobbyIDDto, UserDto } from '../utils/dtos';
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
				alert(error);
			});

			socket.on('forcedLeave', (res) => {
				navigate(Pages.Home);
				if (res?.message) {
					alert(res.message);
				}
			});

			socket.on('forcedMove', (res: LobbyIDDto) => {
				setLobby(res.lobby);
				navigate(Pages.Pong);
			});

			socket.on('forcedDisconnect', (res) => {
				sessionStorage.clear();
				user.setUsername('');
				axios.setAuth({ token: '', username: '' });
				navigate(Pages.Root);
				socket.disconnect();
				if (res?.message) {
					alert(res.message);
				}
			});

			socket.on('responseFriendGame', (response: { lobby: string; accept: boolean }) => {
				if (response.accept) {
					setLobby(response.lobby);
					navigate(Pages.Pong);
				} else {
					alert('Game declined');
				}
			});
		}
		return () => {
			if (socket) {
				socket.off('connect');
				socket.off('reconnect');
				socket.off('forcedMove');
				socket.off('forcedDisconnect');
				socket.off('forcedLeave');
				socket.off('error');
				socket.off('disconnect');
				socket.off('responseFriendGame');
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
