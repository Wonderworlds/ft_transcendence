import React from 'react';
import DropdownMenu from './DropdownMenu.tsx';

const ExtendFriend: React.FC = () => {
	const inviteFriend = () => {
		console.log("j'invite un ami");
	};
	const deleteFriend = () => {
		console.log("j'enleve un ami");
	};

	const dropdownActions = [
		{
			name: 'Invite Friend',
			onClick: inviteFriend,
		},
		{
			name: 'Delete Friend',
			onClick: deleteFriend,
		},
	];

	return (
		<div className="headerExtendFriend">
			<DropdownMenu dropdownButtonName="..." dropdownActions={dropdownActions} />
		</div>
	);
};

export default ExtendFriend;
