import React from 'react';
import { Pages } from '../utils/types';
import { getUser } from '../context/UserContext';

const ButtonAccept: React.FC = () => {
	const user = getUser();
	return (
		<div className="divdisconnectButton">
			<button className="disconnectButton">
				<div
					onClick={() => {
						user.setPage(Pages.Root);
					}}
				>
					<p className="disconnectText">disconnect</p>
				</div>
			</button>
		</div>
	);
};

export default ButtonAccept;
