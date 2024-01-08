import React from 'react';
import NavBar from '../components/NavBar.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import Pong from './Pong.tsx';

const WaitingMatch: React.FC = () => {
	const socket = getSocket();
	const handleSubmit = () => {};
	const [playLocalCB, setPlayLocalCB] = React.useState<boolean[]>([true, false, false]);
	const [playOnlineCB, setPlayOnlineCB] = React.useState<boolean>(false);
	React.useEffect(() => {
		socket.socket.on('ready', (res: any) => {
			console.log('ready', { room: res.room });
			socket.setRoom(res.room);
		});
		return () => {
			socket.socket.off('ready');
		};
	}, []);

	const waitingMatchElement = () => {
		return (
			<div className="waitingMatch">
				<div className="divNav">
					<NavBar />
				</div>
				<div className="divLobby">
					<div className="divCreateLobby">
						<p>Create Lobby</p>
						<div className="divPlayLocal">
							<div className="divPlayLocalList">
								<label className="container">
									2 Player:
									<input type="radio" name="radio" />
									<span className="checkmark"></span>
								</label>
								<label className="container">
									vs AI:
									<input type="radio" name="radio" />
									<span className="checkmark"></span>
								</label>
								<label className="container">
									Tournament:
									<input type="radio" name="radio" />
									<span className="checkmark"></span>
								</label>
							</div>
							<button id="submitButton" onClick={handleSubmit}>
								Play Local
							</button>
						</div>
						<div className="divPlayOnline">
							<button id="submitButton" onClick={handleSubmit}>
								Play Online
							</button>
						</div>
					</div>
					<div className="divFindLobby">
						<p>GameLobby</p>
						<div className="divFindLobbyList"></div>
					</div>
				</div>
			</div>
		);
	};

	const pongElement = () => {
		return <div className="Pong">{<Pong />}</div>;
	};

	return <>{socket.room ? pongElement() : waitingMatchElement()}</>;
};

export default WaitingMatch;
