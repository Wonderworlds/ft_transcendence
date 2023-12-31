import React, { useEffect, useState } from 'react';
import { getSocket } from '../context/WebsocketContext.tsx';
import { eventGame } from '../utils/types.tsx';

export type Position = {
	x: number;
	y: number;
};

export type UpdateGameDto = {
	ball: Position;
	pLeft: Position;
	pRight: Position;
};

const Pong: React.FC = () => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const [pLeft, setPLeft] = useState<Position>({ x: 2, y: 50 });
	const [pRight, setPRight] = useState<Position>({ x: 98, y: 50 });
	const [ball, setBall] = useState<Position>({ x: 50, y: 50 });
	const pressedKeys = new Set<string>();

	useEffect(() => {
		socket.on('updateGame', (res: UpdateGameDto) => {
			//console.log(res);
			if (res) {
				setPLeft(res.pLeft);
				setPRight(res.pRight);
				setBall(res.ball);
			}
		});
		socket.emit('start', { room: socketContext.room });

		return () => {
			socket.off('updateGame');
		};
	}, []);

	const handleKeyDown = (e: KeyboardEvent) => {
		pressedKeys.add(e.key);
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		pressedKeys.delete(e.key);
	};

	const handleKeyPress = () => {
		if (pressedKeys.has('ArrowUp')) {
			sendInput(eventGame.ARROW_UP);
		}
		if (pressedKeys.has('ArrowDown')) {
			sendInput(eventGame.ARROW_DOWN);
		}
		if (pressedKeys.has('s')) {
			sendInput(eventGame.S_KEY);
		}
		if (pressedKeys.has('w')) {
			sendInput(eventGame.W_KEY);
		}
	};

	function sendInput(input: eventGame) {
		socket.emit('input', { room: socketContext.room, input: input });
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
	}, []);

	useEffect(() => {}, [pLeft, pRight, ball]);

	const PongDivStyle = {};
	const PleftStyle = { width: '1.2%', height: '12%', left: `${pLeft.x}%`, top: `${pLeft.y}%` };
	const PrightStyle = {
		width: '1.2%',
		height: '12%',
		left: `${pRight.x - 1.2}%`,
		top: `${pRight.y}%`,
	};
	const BallStyle = { width: '15px', height: '15px', left: `${ball.x}%`, top: `${ball.y}%` };

	return (
		<div className="pong">
			<div className="PONG_TITLE">
				<h1>PONG GAME</h1>
				<p>Position du joueur 1 : {pLeft.y}</p>
				<p>Position du joueur 2 : {pRight.y}</p>
				<div className="GameArea">
					<div className="PongDiv" style={PongDivStyle}>
						<div className="Pleft" style={PleftStyle}></div>
						<div className="Pright" style={PrightStyle}></div>
						<div className="Ball" style={BallStyle}></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Pong;
