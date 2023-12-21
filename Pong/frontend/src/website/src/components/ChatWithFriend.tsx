import React from 'react';

const ChatWithFriend: React.FC = () => {
	return (
		<div className="ChatWithFriendPart">
			<div className="DivShowMessage">
				<p>test message</p>
				<p>test message</p>
			</div>
			<div className="divTypeMessage">
				<div className="divInputMsg">
					<input type="text" id="msgToSend" name="msgToSend" class="msgToSend" />
				</div>
				<div className="divButtonSend">
					<button>send</button>
				</div>
			</div>
		</div>
	);
};

export default ChatWithFriend;