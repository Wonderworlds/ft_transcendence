import React from 'react';
import { Pages, User } from '../utils/types';

interface PlayBigProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	user: User;
}

const PlayBig: React.FC<PlayBigProps> = ({ setpage, user }) => {
	return (
		<div>
			<button className="playBigButton">
				<div
					onClick={() => {
						setpage(Pages.WaitingMatch);
					}}
				>
					<p className="playBigText">PLAY</p>
				</div>
			</button>
		</div>
	);
};

export default PlayBig;
