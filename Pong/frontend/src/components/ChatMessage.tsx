import React from 'react';
import { ChatMessageType } from '../utils/types';

interface ChatMessageProps {
	message: string;
	from: string;
	ppImg?: string;
	type: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, from, ppImg, type }) => {
	const chatPrivateMessageElement = () => {
		return (
			<div className="chatPrivateMessageElement">
				<div className="divChatFrom">
					<img src={ppImg} alt="pp" className="pp" />
					<p>{from}: </p>
				</div>
				<div className="divMessage">
					<p>{message}</p>
				</div>
			</div>
		);
	};

	const chatStandardMessageElement = () => {
		return (
			<div className="chatStandardMessageElement">
				<div className="divChatFrom">
					<img src={ppImg} alt="pp" className="pp" />
					<p>{from}: </p>
				</div>
				<div className="divMessage">
					<p>{message}</p>
				</div>
			</div>
		);
	};

	const chatServerMessageElement = () => {
		return (
			<div className="chatServerMessageElement">
				<div className="sender">
					<p>{from}: </p>
				</div>
				<div className="divMessage">
					<p>{message}</p>
				</div>
			</div>
		);
	};

	const chatBotMessageElement = () => {
		return (
			<div className="chatBotMessageElement">
				<div className="sender">
					<p>{from}: </p>
				</div>
				<div className="divMessage">
					<p>{message}</p>
				</div>
			</div>
		);
	};

	function switchMessage(type: ChatMessageType) {
		switch (type) {
			case ChatMessageType.STANDARD:
				return chatStandardMessageElement();
			case ChatMessageType.PRIVATE:
				return chatPrivateMessageElement();
			case ChatMessageType.BOT:
				return chatBotMessageElement();
			case ChatMessageType.SERVER:
				return chatServerMessageElement();
		}
	}
	return <div className="divChatMessage">{switchMessage(type)}</div>;
};

export default ChatMessage;
