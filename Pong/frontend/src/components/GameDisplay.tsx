import React from 'react';
import ChatInGame from './ChatInGame';

const GameDisplay: React.FC = () => {
	return (
		<div className="headerGameDisplay">
			<div className="emptySpace"></div>
			<div className="divDisplayGame">
				<div className="display">

				</div>
				<div className="divChat">
					<ChatInGame />
				</div>
			</div>
			<div className="emptySpace"></div>
		</div>
	);
};

export default GameDisplay;