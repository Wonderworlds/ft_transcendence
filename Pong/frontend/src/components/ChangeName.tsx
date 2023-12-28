import React from 'react';
import TitleChangeName from '../components/TitleChangeName.tsx';
import WhiteCase from '../components/WhiteCase.tsx';
import DoubleAuthentification from '../components/DoubleAuthentification.tsx';

interface ChangeNameProps {
	setuser: React.Dispatch<React.SetStateAction<any>>;
}

const ChangeName: React.FC<ChangeNameProps> = ({ setuser }) => {
	return (
		<div className="divChangeName">
			<div className="elem1">
				<TitleChangeName />
			</div>
			<div className="elem2">
				<WhiteCase />
			</div>
			<div className="elem3">
				<DoubleAuthentification />
			</div>
		</div>
	);
};

export default ChangeName;
