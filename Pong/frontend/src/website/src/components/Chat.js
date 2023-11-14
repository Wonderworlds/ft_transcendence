import React from 'react';
import { BsChatLeftText } from 'react-icons/bs';

const Chat = () => {
	return (
		<div>
			<button className="chatButton">
				<BsChatLeftText className="icon"/>
			</button>	
		</div>
	);
};

export default Chat;