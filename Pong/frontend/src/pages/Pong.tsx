import React from 'react';
import { eventGame } from '../utils/types.tsx';
import { getGameSocket } from '../context/GameSocketContext.tsx';

interface roomProps {
	room: string;
}

const Pong: React.FC<roomProps> = ({ room }) => {
	const socket = getGameSocket().socket;

	React.useEffect(() => {
		socket.on('updateGame', (res) => {
			console.log(res);
		});
		return () => {
			socket.off('updateGame');
		};
	}, []);

	function sendInput(input: eventGame) {
		console.log(room);
		socket.emit('input', { room: room, event: input });
	}

	async function tmpAuth() {
		sendInput(eventGame.UP);
	}

	return (
		<div className="PONG TITLE">
			<h1>PONG GAME</h1>
			<button className="logInButton" onClick={tmpAuth}>
				<p className="logInText">Log In</p>
			</button>
		</div>
	);
};

export default Pong;
