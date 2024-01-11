import React from 'react';
import { getGame } from '../context/GameContext.tsx';
import Pong from '../pages/Pong.tsx';
import { GameState } from '../utils/dtos.tsx';
import { GameType } from '../utils/types.tsx';
import ChatInGame from './ChatInGame';

const GameDisplay: React.FC = () => {
	const gameContext = getGame();
	const [pseudo, setPseudo] = React.useState<string>('');

	const readyButton = (label: string, handleClick: () => void) => {
		return (
			<>
				<div className="divTitleReady">
					<p>{label}</p>
				</div>
				<div className="divButtonReady">
					<button
						onClick={() => {
							handleClick();
						}}
					>
						Ready
					</button>
				</div>
			</>
		);
	};

	const addClientLocal = (handleClick: (pseudo: string) => void) => {
		return (
			<>
				<input
					type="text"
					placeholder="Add Player"
					onChange={(e) => {
						setPseudo(e.target.value);
					}}
				/>
				<div className="divButtonReady">
					<button
						onClick={() => {
							handleClick(pseudo);
						}}
					>
						Add
					</button>
				</div>
			</>
		);
	};

	return (
		<div className="headerGameDisplay">
			<div className="emptySpace"></div>
			<div className="divDisplayGame">
				<div className="display">
					<div className="displayGame">
						<Pong />
					</div>
					<div className="displayTypeGame">
						<div className="leftDisplayTypeGame">
							<div className="divType">
								<h1>{gameContext.gameType}</h1>
							</div>
							<div className="divNbPlayer">
								<h1>
									nb of player: {gameContext.nbPlayer} / {gameContext.maxPlayer}
								</h1>
							</div>
						</div>
						<div className="RightDisplayTypeGame">
							{gameContext.gameState === GameState.GAMEOVER
								? readyButton(
										gameContext.gameType === GameType.tournamentLocal ? 'Next Game' : 'ReMatch',
										gameContext.nextMatch
								  )
								: null}
							{gameContext.tournamentIsReady
								? readyButton('Start Tournament', gameContext.startTournament)
								: null}
							{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
							{gameContext.gameState === GameState.INIT
								? addClientLocal(gameContext.addClientLocal)
								: null}
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
