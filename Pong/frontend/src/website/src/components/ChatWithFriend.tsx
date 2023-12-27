import React from 'react';

const ChatWithFriend: React.FC = () => {
	return (
		<div className="headerChatWithFriend">
			<div className="divShowMessage">
				<p>test message</p>
				<p>test message</p>
			</div>
			<div className="divTypeMessage">
				<div className="divInputMsg">
					<input type="text" id="msgToSend" name="msgToSend" className="msgToSend" />
				</div>
				<div className="divButtonSend">
					<button>send</button>
				</div>
			</div>
		</div>
	);
};

export default ChatWithFriend;