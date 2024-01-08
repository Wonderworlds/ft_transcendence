import React from 'react';

const ChatInGame: React.FC = () => {
	return (
		<div className="headerChatInGame">
			<div className="divTabChat">

			</div>
			<div className="divChatInGame">
				<p>test</p>
				<p>test</p>
				<p>test</p>
				<p>test</p>
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

export default ChatInGame;