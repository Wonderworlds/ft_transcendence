import React from 'react';
import ExtendFriend from './ExtendFriend.tsx';

interface FriendsInfoProps
{
	pP: string;
	pseudo: string;
	status: string;
}

const FriendsInfo: React.FC<FriendsInfoProps> = ({pP, pseudo, status}) => {
	
	return (
		<div className="headerFriendsInfo">
			<div className="FriendsInfoBox">
				<div className="divFriendInfo">
					<p>{pP} {pseudo} {status}</p>
				</div>
				<div className="divExtendFriend">
					<ExtendFriend />
				</div>
			</div>
		</div>
	);
};

export default FriendsInfo;