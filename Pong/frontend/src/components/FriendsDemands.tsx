import React from 'react';

interface FriendsDemandsProps {
	pseudo: string;
	ppImg: string;
	handleClick(option: string, pseudo: string): void;
}

const FriendsDemands: React.FC<FriendsDemandsProps> = ({ pseudo, ppImg, handleClick }) => {
	return (
		<div className="divFriendDemandsBox">
			<div className="divFriendDemandsButton">
				<p onClick={() => handleClick('accept', pseudo)}>&#x2705;</p>
				<p onClick={() => handleClick('decline', pseudo)}>&#x274C;</p>
			</div>
			<div className="divFriendDemandsSender">
				<p>{pseudo}</p>
				<img src={ppImg} />
			</div>
		</div>
	);
};

export default FriendsDemands;
