import React from 'react';
import MenuFriend from '../components/MenuFriend.tsx';

const ChatFriend: React.FC = () => {
	return (
		<div className="divSplitFriend">
			<div className="divMenu">
				<MenuFriend/>
			</div>
		</div>
	);
};

export default ChatFriend;