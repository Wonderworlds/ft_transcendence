import React from 'react';
import { getUser } from '../context/UserContext';

const ParameterPicture: React.FC = () => {
	const user = getUser();

	return (
		<div className="divParameterPicture">
			<input type="image" id="image" alt="test" src={user.ppImg} />
		</div>
	);
};

export default ParameterPicture;
