import React from 'react';
import NavBar from '../components/NavBar.tsx';
import RoomsList from '../components/RoomsList.tsx'
import ChatWithFriend from '../components/ChatWithFriend.tsx';
import ListMembersRooms from '../components/ListMemberRooms.tsx';

const Rooms: React.FC = () => {
	return (
		<div className="rooms">
			<div className="divNav">
				<NavBar profilePicture="PP" pseudo="Benjamin"/>
			</div>
			<div className="blackScreen">
				<div className="divRooms">
					<RoomsList />
				</div>
				<div className="divChatInRooms">
					<ChatWithFriend />
				</div>
				<div className="divMemberRooms">
					<ListMembersRooms />
				</div>
			</div>
		</div>
	);
};

export default Rooms;