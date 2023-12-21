import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ChatFriend from '../components/ChatFriend.tsx';
import ChatWithFriend from '../components/ChatWithFriend.tsx';

const Chat: React.FC = () => {
	return (
		<div className="chat">
			<div className="divNav">
				<NavBar profilePicture="PP" pseudo="Benjamin"/>
			</div>
			<div className="blackScreen">
				<div className="divFriend">
					<ChatFriend />
				</div>
				<div className="divChatWithFriend">
					<ChatWithFriend />
				</div>
			</div>
		</div>
	);
};

export default Chat;