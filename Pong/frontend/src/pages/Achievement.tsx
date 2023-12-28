import React from 'react';
import Profile from './Profile.tsx';

const Achievement: React.FC = () => {
	return (
		<div>
			<Profile win={9} loose={1} rank={1}/>
		</div>
	);
};

export default Achievement;