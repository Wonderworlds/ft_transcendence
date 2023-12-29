import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ChatWithFriend from '../components/ChatWithFriend.tsx';
import MenuFriend from '../components/MenuFriend.tsx';

interface ChatProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const Chat: React.FC<ChatProps> = ({ setpage }) => {
	return (
		<div className="headerChat">
			<div className="divNav">
				<NavBar setpage={setpage} />
			</div>
			<div className="blackScreen">
				<div className="divFriend">
					<MenuFriend />
				</div>
				<div className="divChatWithFriend">
					<ChatWithFriend />
				</div>
			</div>
		</div>
	);
};

export default Chat;
