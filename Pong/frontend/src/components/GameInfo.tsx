import React from 'react';
import { getGame } from '../context/GameContext';
import { GameState } from '../utils/dtos';
import { GameType } from '../utils/types';

const GameInfo: React.FC = () => {
	const gameContext = getGame();
	const [pseudo, setPseudo] = React.useState<string>('');

	const readyButton = (label: string, handleClick: () => void) => {
		return (
			<>
				<div className="divButtonReady">
					<button
						id="buttonGamePong"
						onClick={() => {
							handleClick();
						}}
					>
						{label}
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
						id="buttonGamePong"
						onClick={() => {
							setPseudo('');
							handleClick(pseudo);
						}}
					>
						<p>Add</p>
					</button>
				</div>
			</>
		);
	};

	const dynamicElement = () => {
		return (
			<>
				{gameContext.gameOver &&
				(gameContext.gameState === GameState.GAMEOVER || gameContext.gameState === GameState.INIT)
					? readyButton('ReMatch', gameContext.nextMatch)
					: null}
				{gameContext.playerReady && gameContext.gameState === GameState.START
					? readyButton('Start Match', gameContext.startMatch)
					: null}
				{(gameContext.gameType === GameType.tournamentLocal ||
					gameContext.gameType === GameType.tournamentOnline) &&
				gameContext.tournamentIsReady &&
				gameContext.gameState === GameState.INIT
					? readyButton('Start Tournament', gameContext.startTournament)
					: null}
				{(gameContext.gameType === GameType.classicLocal ||
					gameContext.gameType === GameType.multiplayerLocal ||
					gameContext.gameType === GameType.tournamentLocal) &&
				gameContext.gameState === GameState.INIT
					? addClientLocal(gameContext.addClientLocal)
					: null}
			</>
		);
	};

	return (
		<>
			<div className="displayTypeGame">
				<h1>{gameContext.gameType}</h1>
				<h1>
					nb of player: {gameContext.nbPlayer} / {gameContext.maxPlayer}
				</h1>
			</div>
			<div className="RightDisplayTypeGame">{dynamicElement()}</div>
		</>
	);
};

export default GameInfo;
