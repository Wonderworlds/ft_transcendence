import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ParametersTitle from '../components/ParametersTitle.tsx';
import ChangeName from '../components/ChangeName.tsx';
import PutPicture from '../components/PutPicture.tsx';
import ButtonAcceptDisconnect from '../components/ButtonAcceptDisconnect.tsx';

interface ParametersProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const Parameters: React.FC<ParametersProps> = ({ setpage }) => {
	return (
		<div className="parameters">
			<div className="divNav">
				<NavBar setpage={setpage} />
			</div>
			<div className="divParametersTop">
				<ParametersTitle />
			</div>
			<div className="divParametersMiddle">
				<ChangeName />
				<PutPicture />
			</div>
			<div className="divParametersBottom">
				<ButtonAcceptDisconnect setpage={setpage} />
			</div>
		</div>
	);
};

export default Parameters;
