import React from 'react';
import NavBar from '../components/NavBar.tsx';
import ParametersTitle from '../components/ParametersTitle.tsx';
import ChangeName from '../components/ChangeName.tsx';
import PutPicture from '../components/PutPicture.tsx';
import ButtonAcceptDisconnect from '../components/ButtonAcceptDisconnect.tsx';
import { User } from '../utils/types.tsx';

interface ParametersProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	setuser: React.Dispatch<React.SetStateAction<any>>;
	user: User;
}

const Parameters: React.FC<ParametersProps> = ({ setpage, user, setuser }) => {
	return (
		<div className="parameters">
			<div className="divNav">
				<NavBar setpage={setpage} user={user} />
			</div>
			<div className="divParametersTop">
				<ParametersTitle />
			</div>
			<div className="divParametersMiddle">
				<ChangeName setuser={setuser} />
				<PutPicture />
			</div>
			<div className="divParametersBottom">
				<ButtonAcceptDisconnect />
			</div>
		</div>
	);
};

export default Parameters;
