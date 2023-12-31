import React from 'react';
import GameDisplayTop from '../components/GameDisplayTop.tsx';
import GameDisplay from '../components/GameDisplay.tsx';

const Game: React.FC = () => {
	return (
		<div className="headerGame">
			<div className="divDisplayTop">
				<GameDisplayTop />
			</div>
			<div className="divDisplayGame">
				<GameDisplay />
			</div>
			<div className="divDisplayBottom">
			</div>
		</div>
	);
};

export default Game;