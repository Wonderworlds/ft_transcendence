import React from 'react';

interface FriendsDemandsProps {
	pseudo?: string;
	ppImg?: string;
	handleClick(option: boolean, pseudo?: string, lobby?: string): void;
	lobby?: string;
}

const FriendsDemands: React.FC<FriendsDemandsProps> = ({ pseudo, ppImg, handleClick, lobby }) => {
	return (
		<div className="divFriendDemandsBox">
			<div className="divFriendDemandsButton">
				<p onClick={() => handleClick(true, pseudo, lobby)}>&#x2705;</p>
				<p onClick={() => handleClick(false, pseudo, lobby)}>&#x274C;</p>
			</div>
			<div className="divFriendDemandsSender">
				<p>{pseudo}</p>
				{ppImg ? <img src={ppImg} /> : null}
			</div>
		</div>
	);
};

export default FriendsDemands;
