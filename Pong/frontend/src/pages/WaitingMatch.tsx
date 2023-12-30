import React from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Pages } from '../utils/types.tsx';
import { getPongSocket } from '../context/PongWebsocketContext.tsx';

interface WaitingMatchProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const WaitingMatch: React.FC<WaitingMatchProps> = ({ setpage }) => {
	const socket = getPongSocket().socket;

	return (
		<div className="waitingMatch">
			<div
				className="divCancel"
				onClick={() => {
					socket.disconnect();
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
