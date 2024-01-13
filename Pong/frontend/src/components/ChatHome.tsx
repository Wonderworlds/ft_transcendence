import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';
import { getSocket } from '../context/WebsocketContext';
import { ChatMessageType } from '../utils/types';
import ChatMessage from './ChatMessage';

export type ChatMessage = {
	from: { pseudo: string; ppImg: string };
	message: string;
	type: ChatMessageType;
};

interface ChatHomeProps {
	setPseudo: React.Dispatch<React.SetStateAction<string>>;
	setInvitation: React.Dispatch<React.SetStateAction<string>>;
	setFriendDemand: React.Dispatch<React.SetStateAction<{ sender: string }>>;
}

const ChatHome: React.FC<ChatHomeProps> = ({ setPseudo, setInvitation, setFriendDemand }) => {
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const [message, setMessage] = React.useState<string>('');
	const [chat, setChat] = React.useState<ChatMessage[]>([]);
	const [room, setRoom] = React.useState<string>('');

	React.useEffect(() => {
		if (!socket) return;
		socket.on('messageLobby', (res: ChatMessage) => {
			console.log(res);
			switch (res.type) {
				case ChatMessageType.UNDEFINED:
					return;
				case ChatMessageType.PROFILE:
					setPseudo(res.message);
					break;
				case ChatMessageType.DEMAND:
					setFriendDemand({ sender: res.from.pseudo });
					break;
				case ChatMessageType.INVITE:
					setInvitation(res.message);
					break;
				default:
					setChat((chat) => [res, ...chat]);
					break;
			}
		});
		socket.on('onJoinChat', (res: string) => {
			console.log('onJoinChat', res);
			setRoom(res);
		});
		socket.emit('joinChat');

		return () => {
			socket.off('messageLobby');
			socket.off('onJoinChat');
			socket.emit('leaveChat');
		};
	}, [socket]);

	const handleClick = () => {
		console.log('message', message);
		if (message === '') return;
		socket.emit('messageChat', { message: message, lobby: room });
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

export default ChatHome;
