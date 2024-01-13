import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getGame } from '../context/GameContext';
import { GameType, Pages } from '../utils/types';
import Cancel from './Cancel';

const GameDisplayTop: React.FC = () => {
	const gameContext = getGame();
	const navigate = useNavigate();
	const elementDefault = () => {
		return (
			<div className="divSingleplayer">
				<div className="divNameFirstPLayer">
					<img src="pp_1.png" />
					<h1>Player</h1>
					<h1>0</h1>
				</div>
				<div className="divPutVersus">
					<h1>VS</h1>
				</div>
				<div className="divNameSecondPLayer">
					<h1>0</h1>
					<h1>Player</h1>
					<img src="pp_1.png" />
				</div>
				<div className="divCancelGameDisplayTop">
					<Cancel
						handleClick={() => {
							navigate(Pages.Home);
						}}
					/>
				</div>
			</div>
		);
	};
	const elementMultijoueur = () => {
		return (
			<div className="divMultiplayer">
				<div className="divInfoPLeft">
					<img src={gameContext.playerLeft.ppImg} />
					<h1 style={{ color: gameContext.playerIsReady1 ? 'green' : 'red' }}>
						{gameContext.playerLeft.pseudo}
					</h1>
					<h1>{gameContext.scorePLeft}</h1>
				</div>
				<div className="divInfoPTop">
					<img src={gameContext.playerTop.ppImg} />
					<h1 style={{ color: gameContext.playerIsReady3 ? 'green' : 'red' }}>
						{gameContext.playerTop.pseudo}
					</h1>
					<h1>{gameContext.scorePTop}</h1>
				</div>
				<div className="divInfoPBottom">
					<img src={gameContext.playerBot.ppImg} />
					<h1 style={{ color: gameContext.playerIsReady4 ? 'green' : 'red' }}>
						{gameContext.playerBot.pseudo}
					</h1>
					<h1>{gameContext.scorePBot}</h1>
				</div>
				<div className="divInfoPRight">
					<img src={gameContext.playerRight.ppImg} />
					<h1 style={{ color: gameContext.playerIsReady2 ? 'green' : 'red' }}>
						{gameContext.playerRight.pseudo}
					</h1>
					<h1>{gameContext.scorePRight}</h1>
				</div>
				<div className="divCancelGameDisplayTop">
					<Cancel
						handleClick={() => {
							navigate(Pages.Home);
						}}
					/>
				</div>
			</div>
		);
	};
	const element1vs1 = () => {
		return (
			<div className="divSingleplayer">
				<div className="divNameFirstPLayer">
					<img src={gameContext.playerLeft.ppImg} />
					<h1 style={{ color: gameContext.playerIsReady1 ? 'green' : 'red' }}>
						{gameContext.playerLeft.pseudo}
					</h1>
					<h1>{gameContext.scorePLeft}</h1>
				</div>
				<div className="divPutVersus">
					<h1>VS</h1>
				</div>
				<div className="divNameSecondPLayer">
					<h1>{gameContext.scorePRight}</h1>
					<h1 style={{ color: gameContext.playerIsReady2 ? 'green' : 'red' }}>
						{gameContext.playerRight.pseudo}
					</h1>
					<img src={gameContext.playerRight.ppImg} />
				</div>
				<div className="divCancelGameDisplayTop">
					<Cancel
						handleClick={() => {
							navigate(Pages.Home);
						}}
					/>
				</div>
			</div>
		);
	};

	const switchGameType = () => {
		if (!gameContext.playerLeft || !gameContext.playerRight) return elementDefault();
		if (
			gameContext.gameType === GameType.multiplayerOnline ||
			gameContext.gameType === GameType.multiplayerLocal
		)
			return elementMultijoueur();
		else return element1vs1();
	};

	return <div className="headerGameDisplayTop">{switchGameType()}</div>;
};

export default GameDisplayTop;
