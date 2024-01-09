import React from 'react';
import { getSocket } from '../context/WebsocketContext';

const LobbyList: React.FC = () => {
	const socket = getSocket().socket;
	// Implement your component logic here
	React.useEffect(() => {}, []);
	return (
		// JSX code for your component's UI
		<div className="divFindLobbyList">{/* Add your component's UI elements here */}</div>
	);
};

export default LobbyList;
