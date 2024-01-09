import React from 'react';
import CreateLobby, { CreateLobbyProps } from '../components/CreateLobby.tsx';
import LobbyList from '../components/LobbyList.tsx';
import NavBar from '../components/NavBar.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import Pong from './Pong.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getSocket();
	const [playLocalCB, setPlayLocalCB] = React.useState<string>('local0');
	const [playOnlineCB, setPlayOnlineCB] = React.useState<string>('online0');

	React.useEffect(() => {
		if (!socket.socket) return;
		socket.socket.on('ready', (res: any) => {
			console.log('ready', { room: res.room });
			socket.setRoom(res.room);
		});
		return () => {
			socket.socket.off('ready');
		};
	}, []);

	const playLocal = () => {
		console.log('playLocal');
	};

	const playOnline = () => {
		console.log('playOnline');
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
		labels: ['2 Players', '4 Players', 'Tournament'],
		scores: ['online0', 'online1', 'online2'],
		buttonSubmit: 'Play Online',
		submit: playOnline,
		state: playOnlineCB,
		setState: setPlayOnlineCB,
	};

	const waitingMatchElement = () => {
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
					</div>
					<div className="divFindLobby">
						<p>Lobby List</p>
						<LobbyList />
					</div>
				</div>
			</div>
		);
	};

	const pongElement = () => {
		return <div className="Pong">{<Pong />}</div>;
	};

	return <>{socket.room ? pongElement() : waitingMatchElement()}</>;
};

export default WaitingMatch;
