import React from 'react';
import DropdownMenu from "./DropdownMenu.tsx";

interface UserName
{
	pseudo: string;
}

const ExtendCheckProfile: React.FC<UserName> = ({pseudo}) => {

	const checkProfile = () => {
		console.log("check profile");
	}
	const inviteToPlay = () => {
		console.log("send invite");
	};
	
	const dropdownActions = [
	{
		name: "checkProfile",
		onClick: checkProfile,
	},
	{
		name: "inviteToPlay",
		onClick: inviteToPlay,
	},
	];

	return (
		<div className="headerExtendInChat">
			<DropdownMenu dropdownButtonName={pseudo} dropdownActions={dropdownActions} />
		</div>
	);
};

export default ExtendCheckProfile;