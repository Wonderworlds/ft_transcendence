import React from 'react';
import { Pages } from '../utils/types';

interface ButtonAcceptProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const ButtonAccept: React.FC<ButtonAcceptProps> = ({ setpage }) => {
	return (
		<div className="divdisconnectButton">
			<button className="disconnectButton">
				<div
					onClick={() => {
						setpage(Pages.Root);
					}}
				>
					<p className="disconnectText">disconnect</p>
				</div>
			</button>
		</div>
	);
};

export default ButtonAccept;
