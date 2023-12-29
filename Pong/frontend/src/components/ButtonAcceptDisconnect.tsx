import React from 'react';
import ButtonAccept from '../components/ButtonAccept.tsx';
import ButtonDisconnect from '../components/ButtonDisconnect.tsx';

interface ButtonAcceptDisconnectProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const ButtonAcceptDisconnect: React.FC<ButtonAcceptDisconnectProps> = ({
	setpage,
}) => {
	return (
		<div className="divButton">
			<div className="elem1">
				<ButtonAccept setpage={setpage} />
			</div>
			<div className="elem2">
				<ButtonDisconnect setpage={setpage} />
			</div>
		</div>
	);
};

export default ButtonAcceptDisconnect;
