import React from 'react';
import GameDisplay from '../components/GameDisplay.tsx';
import GameDisplayTop from '../components/GameDisplayTop.tsx';
import NavBar from '../components/NavBar.tsx';

const Game: React.FC = () => {
	return (
		<div className="headerGame">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divGameChat">
				<div className="divDisplayTop">
					<GameDisplayTop />
				</div>
				<div className="divDisplayGame">
					<GameDisplay />
				</div>
			</div>
		</div>
	);
};

export default Game;
