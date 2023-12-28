import React from 'react';
import ButtonAccept from '../components/ButtonAccept.tsx';
import ButtonDisconnect from '../components/ButtonDisconnect.tsx';

interface ButtonAcceptDisconnectProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	setuser: React.Dispatch<React.SetStateAction<any>>;
}

const ButtonAcceptDisconnect: React.FC<ButtonAcceptDisconnectProps> = ({
	setpage,
	setuser,
}) => {
	return (
		<div className="divButton">
			<div className="elem1">
				<ButtonAccept setpage={setpage} />
			</div>
			<div className="elem2">
				<ButtonDisconnect setpage={setpage} setuser={setuser} />
			</div>
		</div>
	);
};

export default ButtonAcceptDisconnect;
