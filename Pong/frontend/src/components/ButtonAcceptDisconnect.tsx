import React from 'react';
import ButtonAccept from '../components/ButtonAccept.tsx';
import ButtonDisconnect from '../components/ButtonDisconnect.tsx';

const ButtonAcceptDisconnect: React.FC = () => {
	return (
		<div className="divButton">
			<div className="elem1">
				<ButtonAccept />
			</div>
			<div className="elem2">
				<ButtonDisconnect />
			</div>
		</div>
	);
};

export default ButtonAcceptDisconnect;
