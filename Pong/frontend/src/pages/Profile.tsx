import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ChangeName from '../components/ChangeName.tsx';
import PutPicture from '../components/PutPicture.tsx';
import ButtonAcceptDisconnect from '../components/ButtonAcceptDisconnect.tsx';

const Profile: React.FC = () => {
	return (
		<div className="headerProfile">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divParametersTop">
				<h1>Parameters</h1>
			</div>
			<div className="divParametersMiddle">
				<ChangeName />
				<PutPicture />
			</div>
			<div className="divParametersBottom">
				<ButtonAcceptDisconnect />
			</div>
		</div>
	);
};

export default Profile;
