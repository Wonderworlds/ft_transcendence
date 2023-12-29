import React from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Pages, User } from '../utils/types.tsx';

interface WaitingMatchProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const WaitingMatch: React.FC<WaitingMatchProps> = ({ setpage }) => {
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
