import React from 'react';
import { getSocket } from '../context/WebsocketContext';
import { LobbyDto } from '../utils/dtos';
import { GameType } from '../utils/types';

const LobbyList: React.FC = () => {
	const socket = getSocket();

	// React.useEffect(() => {
	// 	if (!socket) return;
	// 	socket.on('lobbyList', (res: any) => {
	// 		console.log('lobbyList', { res });
	// 	});
	// 	return () => {
	// 		socket.off('lobbyList');
	// 	};
	// }, []);

	const lobbyData: LobbyDto[] = [
		{
			id: '1',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'waiting',
		},
		{
			id: '2',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.multiplayer,
			status: 'playing',
		},
		{
			id: '3',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.tournament,
			status: 'waiting',
		},
		{
			id: '4',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
		{
			id: '5',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.tournament,
			status: 'waiting',
		},
		{
			id: '6',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
		{
			id: '7',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
		{
			id: '8',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
		{
			id: '9',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
		{
			id: '10',
			owner: 'floran',
			nbPlayers: 1,
			maxPlayers: 2,
			gametype: GameType.classic,
			status: 'playing',
		},
	];

	const lobbyElement = (lobby: LobbyDto) => {
		let statusStyle;
		if (lobby.status === 'playing')
			statusStyle = {
				backgroundColor: '#1d1b40e8',
				border: '3px solid #80008049',
			};
		else statusStyle = { backgroundColor: '#80008049' };

		return (
			<div key={lobby.id} className="divLobby" style={statusStyle}>
				<p>{lobby.gametype}</p>
				<p>{lobby.owner}</p>
				<p>
					{lobby.nbPlayers} / {lobby.maxPlayers}
				</p>
				<div className={lobby.status === 'waiting' ? 'buttonJoin' : 'buttonSpectate'}>
					<button
						onClick={() => {
							socket.setRoom(lobby.id);
						}}
					>
						{lobby.status === 'waiting' ? 'Join' : 'spectate'}
					</button>
				</div>
			</div>
		);
	};

	return (
		// JSX code for your component's UI
		<div className="divFindLobbyList">
			{lobbyData.map((lobby) => {
				return lobbyElement(lobby);
			})}
		</div>
	);
};

export default LobbyList;
