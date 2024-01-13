import React from 'react';
import { getGame } from '../context/GameContext.tsx';
import Pong from '../pages/Pong.tsx';
import { GameType } from '../utils/types.tsx';
import ChatInGame from './ChatInGame';
import GameInfo from './GameInfo.tsx';
import Pong4P from './Pong4P.tsx';
import ProfilePlayer from './ProfilePlayer.tsx';

const GameDisplay: React.FC = () => {
	const gameContext = getGame();

	const switchTab = () => {
		switch (gameContext.onTab) {
			case 0:
				return gameContext.gameType === GameType.multiplayerOnline ||
					gameContext.gameType === GameType.multiplayerLocal ? (
					<Pong4P />
				) : (
					<Pong />
				);
			case 1:
				return <ProfilePlayer pseudo={gameContext.pseudo} isClicked={gameContext.onTab} />;
		}
	};

	return (
		<div className="headerGameDisplay">
			<div className="display">
				<div className="displayGame">{switchTab()}</div>
				<div className="divGameInfo">
					<GameInfo />
				</div>
			</div>
			<div className="divChat">
				<ChatInGame />
			</div>
		</div>
	);
};

export default GameDisplay;
