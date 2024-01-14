import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { getGame } from '../context/GameContext';
import { getSocket } from '../context/WebsocketContext';
import { ChatMessageType } from '../utils/types';
import ChatMessage from './ChatMessage';

export type ChatMessage = {
	from: { pseudo: string; ppImg: string };
	message: string;
	type: ChatMessageType;
};

const Chat: React.FC = () => {
	const gameContext = getGame();
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const [message, setMessage] = React.useState<string>('');
	const [chat, setChat] = React.useState<ChatMessage[]>([]);

	React.useEffect(() => {
		if (!socket) return;
		socket.on('messageLobby', (res: ChatMessage) => {
			console.log(res);
			if (res.type === ChatMessageType.PROFILE) {
				gameContext.setPseudo(res.message);
				gameContext.setTab((prev) => {
					const newTab = [...prev];
					if (newTab.length === 2) {
						newTab.splice(1, 1);
					}
					newTab.push(res.message);
					return newTab;
				});
				gameContext.setOnTab(1);
			} else setChat((chat) => [res, ...chat]);
		});
		socket.emit('joinChat', { lobby: socketContext.lobby });

		return () => {
			socket.off('messageLobby');
			socket.off('onJoinChat');
			socket.emit('leaveChat', { lobby: socketContext.lobby });
		};
	}, [socket]);

	const handleClick = () => {
		console.log('message', message);
		if (message === '') return;
		socket.emit('messageChat', { message: message, lobby: socketContext.lobby });
		setMessage('');
	};

	const chatMessages = () => {
		return chat.map((msg, index) => {
			let chatMessageProps = {
				key: index,
				message: msg.message,
				type: msg.type,
				ppImg: msg.from?.ppImg,
				from: msg.from?.pseudo,
			};
			if (msg.type === ChatMessageType.SERVER) {
				chatMessageProps = { ...chatMessageProps, from: 'Server' };
			} else if (msg.type === ChatMessageType.BOT) {
				chatMessageProps = { ...chatMessageProps, from: 'Bot' };
			}
			if (msg.message.includes('\n')) {
				const messages = msg.message.split('\n');
				return (
					<div key={index}>
						{messages.map((message, index) => {
							return <ChatMessage {...chatMessageProps} message={message} key={index} />;
						})}
					</div>
				);
			}
			return <ChatMessage {...chatMessageProps} />;
		});
	};

	const handleKeyUp = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};

	React.useEffect(() => {
		window.addEventListener('keyup', handleKeyUp, false);
		return () => {
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [handleKeyUp]);

	return (
		<div className="divChat">
			<div className="chatBox">
				<div className="divChatMessages">{chatMessages()}</div>
				<div className="divChatInput">
					<input
						className="chatInput"
						type="text"
						placeholder="..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button
						className="chatButton"
						onClick={() => {
							handleClick();
						}}
					>
						<BsChatLeftText className="icon" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
