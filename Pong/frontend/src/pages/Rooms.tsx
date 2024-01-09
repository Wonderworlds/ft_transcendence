import React from 'react';
import ChatWithFriend from '../components/ChatWithFriend.tsx';
import ListMembersLobbys from '../components/ListMemberLobbys.tsx';
import LobbysList from '../components/LobbysList.tsx';
import NavBar from '../components/NavBar.tsx';

const Lobbys: React.FC = () => {
	return (
		<div className="headerLobbys">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="blackScreen">
				<div className="divLobbys">
					<LobbysList />
				</div>
				<div className="divChatInLobbys">
					<ChatWithFriend />
				</div>
				<div className="divMemberLobbys">
					<ListMembersLobbys />
				</div>
			</div>
		</div>
	);
};

export default Lobbys;
