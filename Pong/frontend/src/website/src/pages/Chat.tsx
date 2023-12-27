import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ChatWithFriend from '../components/ChatWithFriend.tsx';
import MenuFriend from '../components/MenuFriend.tsx';

const Chat: React.FC = () => {
	return (
		<div className="headerChat">
			<div className="divNav">
				<NavBar profilePicture="PP" pseudo="Benjamin"/>
			</div>
			<div className="blackScreen">
				<div className="divFriend">
					<MenuFriend/>
				</div>
				<div className="divChatWithFriend">
					<ChatWithFriend />
				</div>
			</div>
		</div>
	);
};

export default Chat;