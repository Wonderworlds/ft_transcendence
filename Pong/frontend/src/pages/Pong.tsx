import React from 'react';
import { getSocket } from '../context/WebsocketContext.tsx';
import { eventGame } from '../utils/types.tsx';

interface roomProps {
	room: string;
}

const Pong: React.FC<roomProps> = ({ room }) => {
	const socket = getSocket().socket;

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
