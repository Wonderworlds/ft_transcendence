import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateLobby, { CreateLobbyProps } from '../components/CreateLobby.tsx';
import LobbyList from '../components/LobbyList.tsx';
import NavBar from '../components/NavBar.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import { LobbyDto } from '../utils/dtos.tsx';
import { GameType, Pages } from '../utils/types.tsx';

const WaitingMatch: React.FC = () => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const navigate = useNavigate();
	const [lobbyLocal, setLobbyLocal] = React.useState<LobbyDto>({} as LobbyDto);
	const [playLocalCB, setPlayLocalCB] = React.useState<string>('local0');
	const [playOnlineCB, setPlayOnlineCB] = React.useState<string>('online0');

	React.useEffect(() => {
		if (!socket) return;
		socket.on('lobbyCreated', (res: { lobby: string }) => {
			socketContext.setLobby(res.lobby);
			navigate(Pages.Pong);
		});
		return () => {
			socket.off('lobbyCreated');
		};
	}, [socket]);

	const playLocal = () => {
		if (!socket) return console.log('socket not found');
		const gameType =
			playLocalCB === 'local0'
				? GameType.classic
				: playLocalCB === 'local1'
				? GameType.multiplayer
				: GameType.tournament;
		socket.emit('createLobby', { gameType: gameType, isLocal: true });
	};

	const playOnline = () => {
		if (!socket) return console.log('socket not found');
		const gameType =
			playOnlineCB === 'online0'
				? GameType.classic
				: playOnlineCB === 'online1'
				? GameType.multiplayer
				: GameType.tournament;
		socket.emit('createLobby', { gameType: gameType, isLocal: false });
	};

	const playLocalProps: CreateLobbyProps = {
		labels: ['2 Players', 'vs AI', 'Tournament'],
		scores: ['local0', 'local1', 'local2'],
		buttonSubmit: 'Play Local',
		submit: playLocal,
		state: playLocalCB,
		setState: setPlayLocalCB,
	};

	const playOnlineProps: CreateLobbyProps = {
		labels: [GameType.classic, GameType.multiplayer, GameType.tournament],
		scores: ['online0', 'online1', 'online2'],
		buttonSubmit: 'Play Online',
		submit: playOnline,
		state: playOnlineCB,
		setState: setPlayOnlineCB,
	};

	return (
		<div className="waitingMatch">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divLobby">
				<div className="divCreateLobby">
					<p>Create Lobby</p>
					<CreateLobby {...playLocalProps} />
					<CreateLobby {...playOnlineProps} />

					{lobbyLocal ? (
						<div className="divLobbyLocal">
							<button
								onClick={() => {
									navigate(Pages.Pong);
								}}
							>
								Lobby Local
							</button>
						</div>
					) : null}
				</div>
				<div className="divFindLobby">
					<p>Lobby List</p>
					<LobbyList setLobbyLocal={setLobbyLocal} />
				</div>
			</div>
		</div>
	);
};

export default WaitingMatch;
