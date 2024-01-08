import React from 'react';
import { Msg } from '../utils/types.tsx';
import ProfileInfo from './ProfileInfo.tsx'

const ChatInGame: React.FC = () => {
	let FriendsList = new Array<{msg: Msg}>();
	let p1 = {pseudo:"Ben", text: "test"} as Msg;
	let p2 = {pseudo:"Jean", text: "test"} as Msg;

	FriendsList.push({
		msg: p1
	});
	FriendsList.push({
		msg: p2
	});
	FriendsList.push({
		msg: p1
	});
	FriendsList.push({
		msg: p2
	});

	const chatElement: any = FriendsList.map((item) => {
		return (
			<ProfileInfo pseudo={item.msg.pseudo} text={item.msg.text} />
		);
	});

	return (
		<div className="headerChatInGame">
			<div className="divTabChat">

			</div>
			<div className="divChatInGame">
				{chatElement}
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