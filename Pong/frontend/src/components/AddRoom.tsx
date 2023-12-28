import React from 'react';
import DropdownMenu from './DropdownMenu.tsx';

const AddRoom = () => {
	
	const createRoom = () => {
		console.log("je creer une room");
	}
	const searchRoom = () => {
		console.log("je cherche une room");
	};
	
	const dropdownActions = [
	{
		name: "Create Room",
		onClick: createRoom,
	},
	{
		name: "Search Room",
		onClick: searchRoom,
	},
	];

	return (
		<div className="headerAddRoom">
			<DropdownMenu dropdownButtonName="+" dropdownActions={dropdownActions} />
		</div>
	);
};

export default AddRoom;
