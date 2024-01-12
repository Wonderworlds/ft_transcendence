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

const Chat: React.FC = () => {
	const socket = getSocket().socket;
	const [message, setMessage] = React.useState<string>('');
	const [chat, setChat] = React.useState<ChatMessage[]>([]);

	React.useEffect(() => {
		if (!socket) return;
		socket.on('messageLobby', (res: ChatMessage) => {
			console.log(res);
			setChat((chat) => [...chat, res]);
		});

		return () => {
			socket.off('messageLobby');
		};
	}, [socket]);

	const handleClick = () => {
		socket.emit('messageChatTest', message);
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
			return <ChatMessage {...chatMessageProps} />;
		});
	};

	return (
		<div>
			<div className="chatBox">
				<div>
					{chatMessages()}
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
