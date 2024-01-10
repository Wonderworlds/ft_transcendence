import React from 'react';
import DropleftMenu from './DropleftMenu';

interface UserName {
	pseudo: string;
}

const ExtendCheckProfile: React.FC<UserName> = ({ pseudo }) => {
	const checkProfile = () => {
		console.log('check profile');
	};
	const inviteToPlay = () => {
		console.log('send invite');
	};

	const dropleftActions = [
		{
			name: 'checkProfile',
			onClick: checkProfile,
		},
		{
			name: 'inviteToPlay',
			onClick: inviteToPlay,
		},
	];

	return (
		<div className="headerExtendInChat">
			<DropleftMenu dropleftButtonName={pseudo} dropleftActions={dropleftActions} />
		</div>
	);
};

export default ExtendCheckProfile;
