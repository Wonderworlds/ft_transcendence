import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../context/WebsocketContext';
import { GameState, LobbyDto } from '../utils/dtos';
import { Pages } from '../utils/types';

interface LobbyListProps {
	setLobbyLocal: React.Dispatch<React.SetStateAction<LobbyDto>>;
}

const LobbyList: React.FC<LobbyListProps> = ({ setLobbyLocal }) => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const navigate = useNavigate();
	const [lobbyList, setLobbyList] = React.useState<LobbyDto[]>([]);
	const [lobbyRejoin, setLobbyRejoin] = React.useState<LobbyDto[]>([]);

	React.useEffect(() => {
		if (!socket) return;
		socket.on(
			'lobbyList',
			(res: { lobbys: LobbyDto[]; lobbyLocal: LobbyDto; lobbyRejoin: LobbyDto[] }) => {
				console.log(res);
				setLobbyList(res.lobbys);
				setLobbyRejoin(res.lobbyRejoin);
				setLobbyLocal(res.lobbyLocal);
			}
		);
		socket.emit('getLobbys');
		return () => {
			socket.off('lobbyList');
		};
	}, [socket]);

	const lobbyElement = (lobby: LobbyDto, rejoin: boolean) => {
		let statusStyle;
		if (rejoin)
			statusStyle = {
				backgroundColor: '#1d1b40e8',
				border: '3px solid #80008049',
			};
		else statusStyle = { backgroundColor: '#80008049' };

		return (
			<div key={lobby.id} className="divLobby" style={statusStyle}>
				<p>{lobby.gameType}</p>
				<p>{lobby.owner}</p>
				<p>
					{lobby.nbPlayers} / {lobby.maxPlayers}
				</p>
				<div className={lobby.status === GameState.INIT ? 'buttonJoin' : 'buttonSpectate'}>
					<button
						onClick={() => {
							socketContext.setLobby(lobby.id);
							navigate(Pages.Pong);
						}}
					>
						{lobby.status === GameState.INIT ? 'Join' : 'Rejoin'}
					</button>
				</div>
			</div>
		);
	};

	return (
		// JSX code for your component's UI
		<div className="divFindLobbyList">
			{lobbyRejoin.map((lobby) => {
				return lobbyElement(lobby, true);
			})}
			{lobbyList.map((lobby) => {
				return lobbyElement(lobby, false);
			})}
		</div>
	);
};

export default LobbyList;
