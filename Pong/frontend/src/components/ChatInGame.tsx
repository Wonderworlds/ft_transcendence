import React from 'react';
import { getGame } from '../context/GameContext.tsx';
import Chat from './Chat.tsx';

export enum ChatTabs {
	Pong = 'Pong',
	Profile = 'Test',
	Bracket = 'Bracket',
}

const ChatInGame: React.FC = () => {
	const gameContext = getGame();

	const tabElement = () => {
		const maps = gameContext.tab.map((tab, index) => {
			return (
				<button
					key={index}
					className="tabChat"
					onClick={() => {
						gameContext.setOnTab(index);
					}}
				>
					<p>{tab}</p>
				</button>
			);
		});
		return maps;
	};

	return (
		<div className="headerChatInGame">
			<div className="divTabChat">{tabElement()}</div>
			<div className="divChatInGame">
				<Chat />
			</div>
		</div>
	);
};

export default ChatInGame;
