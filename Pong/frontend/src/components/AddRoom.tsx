import DropdownMenu from './DropdownMenu.tsx';

const AddLobby = () => {
	const createLobby = () => {
		console.log('je creer une lobby');
	};
	const searchLobby = () => {
		console.log('je cherche une lobby');
	};

	const dropdownActions = [
		{
			name: 'Create Lobby',
			onClick: createLobby,
		},
		{
			name: 'Search Lobby',
			onClick: searchLobby,
		},
	];

	return (
		<div className="headerAddLobby">
			<DropdownMenu dropdownButtonName="+" dropdownActions={dropdownActions} />
		</div>
	);
};

export default AddLobby;
