import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ChatWithFriend from '../components/ChatWithFriend.tsx';
import MenuFriend from '../components/MenuFriend.tsx';
import { User } from '../utils/types.tsx';

interface ChatProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	user: User;
}

const Chat: React.FC<ChatProps> = ({ setpage, user }) => {
	return (
		<div className="headerChat">
			<div className="divNav">
				<NavBar setpage={setpage} user={user} />
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
