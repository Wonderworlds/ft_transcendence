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

	useEffect(() => {
		socket.on('updateGame', (res: UpdateGameDto) => {
			console.log(res);
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
		switch (e.key) {
			case 'ArrowUp':
				sendInput(eventGame.ARROW_UP);
				break;
			case 'ArrowDown':
				sendInput(eventGame.ARROW_DOWN);
				break;
			case 'w':
				sendInput(eventGame.W_KEY);
				break;
			case 's':
				sendInput(eventGame.S_KEY);
				break;
			default:
				break;
		}
	};

	function sendInput(input: eventGame) {
		socket.emit('input', { room: socketContext.room, input: input });
	}

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown, false);
		return () => {
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
	const BallStyle = { width: '20px', height: '20px', left: `${ball.x}%`, top: `${ball.y}%` };

	return (
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
	);
};

export default Pong;
