import React from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Pages, User } from '../utils/types.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';

interface WaitingMatchProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const WaitingMatch: React.FC<WaitingMatchProps> = ({ setpage }) => {
	const socketContext = getSocket();

	React.useEffect(() => {
		socketContext.socket.on('matchFound', () => {
			console.log('Match Found');
			// Need to change page to PONG;
		});
		socketContext.socket.emit('searchMatch');

		return () => {
			socketContext.socket.off('matchFound');
		};
	}, []);

	return (
		<div className="waitingMatch">
			<div
				className="divCancel"
				onClick={() => {
					setpage(Pages.Home);
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

export default WaitingMatch;
