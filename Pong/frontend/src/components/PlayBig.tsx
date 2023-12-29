import React from 'react';
import { Pages } from '../utils/types';

interface PlayBigProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const PlayBig: React.FC<PlayBigProps> = ({ setpage }) => {
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
