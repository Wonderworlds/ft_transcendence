import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ParametersTitle from '../components/ParametersTitle.tsx';
import ChangeName from '../components/ChangeName.tsx';
import PutPicture from '../components/PutPicture.tsx';
import ButtonAcceptDisconnect from '../components/ButtonAcceptDisconnect.tsx';

const Parameters: React.FC = () => {
	return (
		<div className="parameters">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divParametersTop">
				<ParametersTitle />
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

export default Parameters;
