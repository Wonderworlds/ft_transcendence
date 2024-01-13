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
			//console.log(res);
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
		if (pressedKeys.has('ArrowUp')) {
			sendInput(EventGame.ARROW_UP);
		}
		if (pressedKeys.has('ArrowDown')) {
			sendInput(EventGame.ARROW_DOWN);
		}
		if (pressedKeys.has('s')) {
			sendInput(EventGame.S_KEY);
		}
		if (pressedKeys.has('w')) {
			sendInput(EventGame.W_KEY);
		}
		if (pressedKeys.has('ArrowLeft')) {
			sendInput(EventGame.ARROW_LEFT);
		}
		if (pressedKeys.has('ArrowRight')) {
			sendInput(EventGame.ARROW_RIGHT);
		}
		if (pressedKeys.has('d')) {
			sendInput(EventGame.D_KEY);
		}
		if (pressedKeys.has('a')) {
			sendInput(EventGame.A_KEY);
		}
	};

	function sendInput(input: EventGame) {
		if (socket && socketContext.lobby && user.pseudo)
			socket.emit('input', { lobby: socketContext.lobby, input: input, pseudo: user.pseudo });
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
						<div className="Pleft" style={PleftStyle}></div>
						<div className="Pright" style={PrightStyle}></div>
						<div className="Ptop" style={PtopStyle}></div>
						<div className="Pbot" style={PbotStyle}></div>
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
