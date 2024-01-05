import React, { useEffect, useState } from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { getGameSocket } from '../context/GameSocketContext.tsx';
import Pong from './Pong.tsx';
import { Link } from 'react-router-dom';
import { Pages } from '../utils/types.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getGameSocket().socket;
	const [room, setRoom] = useState<string>('');

	useEffect(() => {
		socket.on('ready', (res: { room: string }) => {
			console.log(res);
			setRoom(res.room);
		});

		return () => {
			socket.off('ready');
		};
	}, []);

	const waitingMatchElement = () => {
		return (
			<div className="waitingMatch">
				<div
					className="divCancel"
					onClick={() => {
						socket.disconnect();
					}}
				>
					<Link to={Pages.Home}>
						<Cancel />
					</Link>
				</div>
				<div className="divSearchingPlayer">
					<SearchingPlayer />
				</div>
			</div>
		);
	};

	const pongElement = () => {
		return <div className="Pong">{<Pong room={room} />}</div>;
	};

	return <>{room ? pongElement() : waitingMatchElement()}</>;
};

export default WaitingMatch;
