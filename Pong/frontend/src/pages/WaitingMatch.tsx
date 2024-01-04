import React, { useEffect, useState } from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Pages } from '../utils/types.tsx';
import { getUser } from '../context/UserContext.tsx';
import { getGameSocket } from '../context/GameSocketContext.tsx';
import Pong from './Pong.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getGameSocket().socket;
	const user = getUser();
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
						user.setPage(Pages.Home);
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
		return <div className="Pong">{<Pong room={room} />}</div>;
	};

	return <>{room ? pongElement() : waitingMatchElement()}</>;
};

export default WaitingMatch;
