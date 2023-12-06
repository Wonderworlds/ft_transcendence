import React from 'react';
import SearchingPlayer from '../components/SearchingPlayer.tsx';
import Cancel from '../components/Cancel.tsx';
import { Link } from 'react-router-dom';

const WaitingMatch = () => {
	return (
		<div className="waitingMatch">
			<div className="divCancel">
				<Link to="/Home"><Cancel /></Link>
			</div>
			<div className="divSearchingPlayer">
				<SearchingPlayer />
			</div>
		</div>
	);
};

export default WaitingMatch;