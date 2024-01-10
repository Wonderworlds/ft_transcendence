import React from 'react';
import ChatInGame from './ChatInGame';
import { TypeMatch } from '../utils/types.tsx';

const GameDisplay: React.FC = () => {
	let TypeGame = new Array<{typeMatch: TypeMatch}>();
	let p = {type:"type: 1 VS 1", player:12, tournament:1} as TypeMatch;

	TypeGame.push({
		typeMatch: p
	});

	const titleTypeGame: any = TypeGame.map((item) => {
		if (item.typeMatch.tournament == 0)
			return (
				<h1>Start Match</h1>
			);
		else
			return (
				<h1>Start Tournament</h1>
			);
	});

	return (
		<div className="headerGameDisplay">
			<div className="emptySpace"></div>
			<div className="divDisplayGame">
				<div className="display">
					<div className="displayGame">

					</div>
					<div className="displayTypeGame">
						<div className="leftDisplayTypeGame">
							<div className="divType">
								<h1>{p.type}</h1>
							</div>
							<div className="divNbPlayer">
								<h1>nb of player:</h1>
								<h1>{p.player}</h1>
							</div>
						</div>
						<div className="RightDisplayTypeGame">
							<div className="divTitleReady">
								{titleTypeGame}
							</div>
							<div className="divButtonReady">
								<button>Ready</button>
							</div>
						</div>
					</div>
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