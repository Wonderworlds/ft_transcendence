import React from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Pages } from '../utils/types.tsx';
import { getPongSocket } from '../context/PongWebsocketContext.tsx';
import { getUser } from '../context/UserContext.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getPongSocket().socket;
	const user = getUser();

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

export default WaitingMatch;
