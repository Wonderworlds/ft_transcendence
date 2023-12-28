import React from 'react';
import TitleDoubleAuthentification from '../components/TitleDoubleAuthentification.tsx';
import CheckBox from '../components/CheckBox.tsx';

const DoubleAuthentification: React.FC = () => {
	return (
		<div className="elemDoubleAuthentification">
			<div className="elem1">
				<TitleDoubleAuthentification/>
			</div>
			<div className="elem2">
				<CheckBox/>
			</div>
		</div>
	);
};

export default DoubleAuthentification;