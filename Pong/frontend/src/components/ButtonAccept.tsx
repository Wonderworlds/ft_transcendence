import React from 'react';
import { Pages } from '../utils/types';

interface ButtonAcceptProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const ButtonAccept: React.FC<ButtonAcceptProps> = ({ setpage }) => {
	return (
		<div className="divAcceptButton">
			<button className="acceptButton">
				<div
					onClick={() => {
						setpage(Pages.Home);
					}}
				>
					<p className="acceptText">accept change</p>
				</div>
			</button>
		</div>
	);
};

export default ButtonAccept;
