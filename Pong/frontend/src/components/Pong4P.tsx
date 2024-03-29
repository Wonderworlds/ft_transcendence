import React, { useEffect, useState } from 'react';
import { getGame } from '../context/GameContext';
import { getUser } from '../context/UserContext';
import { getSocket } from '../context/WebsocketContext';
import { Position } from '../pages/Pong';
import { GameState } from '../utils/dtos';
import { EventGame } from '../utils/types';

type UpdateGameDtoConfirmed = {
	pLeft: Position;
	pRight: Position;
	pTop: Position;
	pBot: Position;
	ball: Position;
	scorePLeft: number;
	scorePRight: number;
	scorePTop: number;
	scorePBot: number;
};

const Pong4P: React.FC = () => {
	const user = getUser();
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const gameContext = getGame();
	const [pLeft, setPLeft] = useState<Position>({ x: 2, y: 50 });
	const [pRight, setPRight] = useState<Position>({ x: 98, y: 50 });
	const [pTop, setPTop] = useState<Position>({ x: 50, y: 2 });
	const [pBot, setPBot] = useState<Position>({ x: 50, y: 98 });
	const [ball, setBall] = useState<Position>({ x: 50, y: 50 });
	const pressedKeys = new Set<string>();

	useEffect(() => {
		if (!socket) return;
		socket.on('updateGame', (res: UpdateGameDtoConfirmed) => {
			if (res) {
				setPLeft(res.pLeft);
				setPRight(res.pRight);
				setPTop(res.pTop);
				setPBot(res.pBot);
				setBall(res.ball);
				gameContext.setScorePLeft(res.scorePLeft);
				gameContext.setScorePRight(res.scorePRight);
				gameContext.setScorePTop(res.scorePTop);
				gameContext.setScorePBot(res.scorePBot);
			}
		});

		return () => {
			socket.off('updateGame');
		};
	}, [socketContext.lobby]);

	const handleKeyDown = (e: KeyboardEvent) => {
		pressedKeys.add(e.key);
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		pressedKeys.delete(e.key);
	};

	const handleKeyPress = () => {
		const inputs: EventGame[] = [];
		if (pressedKeys.has('ArrowUp')) {
			inputs.push(EventGame.ARROW_UP);
		}
		if (pressedKeys.has('ArrowDown')) {
			inputs.push(EventGame.ARROW_DOWN);
		}
		if (pressedKeys.has('s')) {
			inputs.push(EventGame.S_KEY);
		}
		if (pressedKeys.has('w')) {
			inputs.push(EventGame.W_KEY);
		}
		if (pressedKeys.has('ArrowLeft')) {
			inputs.push(EventGame.ARROW_LEFT);
		}
		if (pressedKeys.has('ArrowRight')) {
			inputs.push(EventGame.ARROW_RIGHT);
		}
		if (pressedKeys.has('d')) {
			inputs.push(EventGame.D_KEY);
		}
		if (pressedKeys.has('a')) {
			inputs.push(EventGame.A_KEY);
		}
		sendInput(inputs);
	};

	function sendInput(inputs: EventGame[]) {
		if (socket && socketContext.lobby && user.pseudo)
			socket.emit('inputs', { lobby: socketContext.lobby, inputs: inputs, pseudo: user.pseudo });
	}

	window.requestAnimationFrame(gameLoop);

	function gameLoop() {
		if (pressedKeys.size != 0) {
			handleKeyPress();
		}
		window.requestAnimationFrame(gameLoop);
	}

	useEffect(() => {
		window.addEventListener('keyup', handleKeyUp, false);
		window.addEventListener('keydown', handleKeyDown, false);
		return () => {
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [socketContext.lobby, user.pseudo]);

	const PleftStyle = { width: '1.2%', height: '12%', left: `${pLeft.x}%`, top: `${pLeft.y}%` };
	const PrightStyle = {
		width: '1.2%',
		height: '12%',
		left: `${pRight.x - 1.2}%`,
		top: `${pRight.y}%`,
	};
	const PtopStyle = { width: '12%', height: '1.2%', left: `${pTop.x}%`, top: `${pTop.y}%` };
	const PbotStyle = { width: '12%', height: '1.2%', left: `${pBot.x}%`, top: `${pBot.y}%` };
	const BallStyle = { width: '15px', height: '15px', left: `${ball.x}%`, top: `${ball.y}%` };

	const pongElement = (gameState: GameState) => {
		switch (gameState) {
			case GameState.INIT: {
				return (
					<>
						<h1>INIT</h1>
					</>
				);
			}
			case GameState.START:
				return (
					<>
						<h1>START</h1>;
					</>
				);
			case GameState.PLAYING:
				return (
					<>
						{gameContext.scorePLeft ? <div className="Pleft" style={PleftStyle}></div> : null}
						{gameContext.scorePRight ? <div className="Pright" style={PrightStyle}></div> : null}
						{gameContext.scorePTop ? <div className="Ptop" style={PtopStyle}></div> : null}
						{gameContext.scorePBot ? <div className="Pbot" style={PbotStyle}></div> : null}
						<div className="Ball" style={BallStyle}></div>
					</>
				);
			case GameState.PAUSE:
				return (
					<>
						<h1>PAUSE</h1>;
					</>
				);
			case GameState.GAMEOVER:
				return (
					<>
						<h1>GAMEOVER</h1>;
					</>
				);
		}
	};
	return (
		<div className="GameArea4P">
			<div className="PongDiv4P">{pongElement(gameContext.gameState)}</div>
		</div>
	);
};

export default Pong4P;
