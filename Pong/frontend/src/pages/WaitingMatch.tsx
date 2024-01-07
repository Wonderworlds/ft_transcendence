import React from 'react';
import { Link } from 'react-router-dom';
import Cancel from '../components/Cancel.tsx';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import { Pages } from '../utils/types.tsx';
import Pong from './Pong.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getSocket();

	React.useEffect(() => {
		socket.socket.on('ready', (res: any) => {
			console.log('ready', { room: res.room });
			socket.setRoom(res.room);
		});
		socket.socket.emit('searchGame');
		return () => {
			socket.socket.off('ready');
		};
	}, []);

	React.useEffect(() => {
		return () => {
			window.onpopstate = () => {
				socket.socket.emit('cancelSearch');
			};
		};
	}, []);

	const waitingMatchElement = () => {
		return (
			<div className="waitingMatch">
				<Link to={Pages.Home}>
					<div
						className="divCancel"
						onClick={() => {
							socket.socket.emit('cancelSearch');
						}}
					>
						<Cancel />
					</div>
				</Link>
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
