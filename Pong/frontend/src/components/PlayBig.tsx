import React from 'react';
import { Link } from 'react-router-dom';

const PlayBig: React.FC = () => {
	return (
		<div>
			<button className="playBigButton">
				<Link to="/WaitingMatch"><p className="playBigText">PLAY</p></Link>
			</button>
		</div>
	);
};

export default PlayBig;