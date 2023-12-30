import React from 'react';
import { Pages } from '../utils/types';
import { getUser } from '../context/UserContext';

const PlayBig: React.FC = () => {
	const user = getUser();

	return (
		<div>
			<button className="playBigButton">
				<div
					onClick={() => {
						user.setPage(Pages.WaitingMatch);
					}}
				>
					<p className="playBigText">PLAY</p>
				</div>
			</button>
		</div>
	);
};

export default PlayBig;
