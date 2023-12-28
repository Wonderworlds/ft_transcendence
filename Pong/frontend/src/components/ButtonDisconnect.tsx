import React from 'react';
import { Pages, Status, User } from '../utils/types';

interface ButtonAcceptProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	setuser: React.Dispatch<React.SetStateAction<any>>;
}

const ButtonAccept: React.FC<ButtonAcceptProps> = ({ setpage, setuser }) => {
	const newUser: User = { pseudo: '', ppImg: '', status: Status.Online };
	return (
		<div className="divdisconnectButton">
			<button className="disconnectButton">
				<div
					onClick={() => {
						setpage(Pages.Root);
						setuser(newUser);
					}}
				>
					<p className="disconnectText">disconnect</p>
				</div>
			</button>
		</div>
	);
};

export default ButtonAccept;
