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
		switch (gameContext.gameType) {
			case GameType.classicLocal: {
				return (
					<>
						{gameContext.gameOver ? readyButton('ReMatch', gameContext.nextMatch) : null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
						{gameContext.gameState === GameState.INIT
							? addClientLocal(gameContext.addClientLocal)
							: null}
					</>
				);
			}
			case GameType.multiplayerLocal: {
				return (
					<>
						{gameContext.gameOver ? readyButton('ReMatch', gameContext.nextMatch) : null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
						{gameContext.gameState === GameState.INIT
							? addClientLocal(gameContext.addClientLocal)
							: null}
					</>
				);
			}
			case GameType.classicOnline: {
				return (
					<>
						{gameContext.gameOver ? readyButton('ReMatch', gameContext.nextMatch) : null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
					</>
				);
			}
			case GameType.multiplayerOnline: {
				return (
					<>
						{gameContext.gameOver ? readyButton('ReMatch', gameContext.nextMatch) : null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
					</>
				);
			}
			case GameType.tournamentLocal: {
				return (
					<>
						{gameContext.gameOver ? readyButton('Next Game', gameContext.nextMatch) : null}
						{gameContext.tournamentIsReady
							? readyButton('Start Tournament', gameContext.startTournament)
							: null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
						{gameContext.gameState === GameState.INIT
							? addClientLocal(gameContext.addClientLocal)
							: null}
					</>
				);
			}
			case GameType.tournamentOnline: {
				return (
					<>
						{gameContext.tournamentIsReady
							? readyButton('Start Tournament', gameContext.startTournament)
							: null}
						{gameContext.playerReady ? null : readyButton('Start Match', gameContext.startMatch)}
					</>
				);
			}
		}
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
