import React, { useContext, useState } from 'react';
import { WebsocketContext } from '../context/WebsocketContext';

type MessagePayload = {
	content: string;
	msg: string;
};

export const Websocket = () => {
	const socket = useContext(WebsocketContext);
	const [value, setValue] = useState('');
	const [messages, setMessages] = useState<MessagePayload[]>([]);

	React.useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected');
		});
		socket.on('onMessage', (newMessage: MessagePayload) => {
			console.log('onMessage event received');
			setMessages((prev) => [...prev, newMessage]);
		});

		return () => {
			console.log('unregestering events ...');
			socket.off('connect');
			socket.off('onMessage');
		};
	}, []);

	const onSubmit = () => {
		socket.emit('newMessage', value);
		setValue('');
	};

	function printMessage() {
		const newArr = messages.map((msg) => <h4>{msg.content}</h4>);
		return newArr;
	}
	return (
		<div>
			<div>
				<h1>Websocket Component</h1>
				{messages.length > 0 ? (
					<div>{printMessage()}</div>
				) : (
					<h4>No Messages</h4>
				)}
				<input
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button onClick={onSubmit}>Submit</button>
			</div>
		</div>
	);
};
