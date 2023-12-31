import React from 'react';
import { User } from '../utils/types.tsx';
import FriendsInfo from '../components/FriendsInfo.tsx';

const Friends: React.FC = () => {
	let FriendsList = new Array<{user: User}>();
	let p1 = {pseudo:"Ben", ppImg: "b.png", status: "Online"} as User;
	let p2 = {pseudo:"Jean", ppImg: "j.png", status: "Offline"} as User;

	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});
	FriendsList.push({
		user: p2
	});
	FriendsList.push({
		user: p1
	});

	const friendsElement: any = FriendsList.map((item) => {
		return (
			<FriendsInfo pP={item.user.ppImg} pseudo={item.user.pseudo} status={item.user.status} />
		);
	});

	return (
		<div className="headerFriends">
			<div className="divFriendElement">
				{friendsElement}
			</div>
			<div className="divAddFriendButton">
				<button>Add Friend</button>
			</div>
		</div>
	);
};

export default Friends;