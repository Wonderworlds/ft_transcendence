import React from 'react';
import { Msg } from '../utils/types.tsx';
import ProfileInfo from './ProfileInfo.tsx'
import SystemInfo from './SystemInfo.tsx';

const ChatInGame: React.FC = () => {
	let FriendsList = new Array<{msg: Msg}>();
	let p1 = {pseudo:"Tao", text: "test", type:1} as Msg;
	let p2 = {pseudo:"sneaky Tao", text: "test", type:2} as Msg;
	let p3 = {pseudo:"system", text: "get ready for next pong", type:0} as Msg;

	FriendsList.push({
		msg: p1
	});
	FriendsList.push({
		msg: p3
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
		if (item.msg.type >= 1)
			return (
				<ProfileInfo pseudo={item.msg.pseudo} text={item.msg.text} type={item.msg.type}/>
			);
		else
			return (
				<SystemInfo text={item.msg.text}/>
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