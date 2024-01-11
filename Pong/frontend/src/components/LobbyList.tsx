import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getSocket } from '../context/WebsocketContext';
import { GameState, LobbyDto } from '../utils/dtos';
import { Pages } from '../utils/types';

const LobbyList: React.FC<{ setLobbyLocal: React.Dispatch<React.SetStateAction<LobbyDto>> }> = ({
	setLobbyLocal,
}) => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const navigate = useNavigate();
	const [lobbyList, setLobbyList] = React.useState<LobbyDto[]>([]);

	React.useEffect(() => {
		if (!socket) return;
		socket.on('lobbyList', (res: { lobbys: LobbyDto[]; lobbyLocal: LobbyDto }) => {
			console.log(res);
			setLobbyList(res.lobbys);
			setLobbyLocal(res.lobbyLocal);
		});
		socket.emit('getLobbys');
		return () => {
			socket.off('lobbyList');
		};
	}, [socket]);

	const lobbyElement = (lobby: LobbyDto) => {
		let statusStyle;
		if (lobby.status !== GameState.INIT)
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
						{lobby.status === GameState.INIT ? 'Join' : 'spectate'}
					</button>
				</div>
			</div>
		);
	};

	return (
		// JSX code for your component's UI
		<div className="divFindLobbyList">
			{lobbyList.map((lobby) => {
				return lobbyElement(lobby);
			})}
		</div>
	);
};

export default LobbyList;
