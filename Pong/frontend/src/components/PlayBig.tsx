import React from 'react';
import { Link } from 'react-router-dom';
import { Pages } from '../utils/types';

const PlayBig: React.FC = () => {
	return (
		<div>
			<button className="playBigButton">
				<Link to={Pages.WaitingMatch}>
					<p className="playBigText">PLAY</p>
				</Link>
			</button>
		</div>
	);
};

export default PlayBig;
