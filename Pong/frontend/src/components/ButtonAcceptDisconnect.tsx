import React from 'react';
import { getUser } from '../context/UserContext';
import { Pages } from '../utils/types';

const ButtonAcceptDisconnect: React.FC = () => {
	const user = getUser();

	return (
		<div className="divButton">
			<div className="divAcceptButton">
				<button className="acceptButton">
					<div
						onClick={() => {
							user.setPage(Pages.Root);
						}}
					>
						<p className="acceptText">Accept change</p>
					</div>
				</button>
			</div>
			<div className="divDisconnectButton">
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
		</div>
	);
};

export default ButtonAcceptDisconnect;
