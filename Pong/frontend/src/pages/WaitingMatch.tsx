import React from 'react';
import Cancel from '../components/Cancel.tsx';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import Pong from './Pong.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getSocket();

	React.useEffect(() => {
		console.log(socket);
		socket.socket.on('ready', (res: any) => {
			console.log('ready', { room: res.room });
			socket.setRoom(res.room);
		});
		socket.socket.emit('searchGame');
		return () => {
			socket.socket.off('ready');
		};
	}, []);

	const waitingMatchElement = () => {
		return (
			<div className="waitingMatch">
				<div
					className="divCancel"
					onClick={() => {
						socket.socket.disconnect();
					}}
				>
					<Cancel />
				</div>
				<div className="divSearchingPlayer">
					<SearchingPlayer />
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
