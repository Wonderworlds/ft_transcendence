import React from 'react';
import { getUser } from '../context/UserContext';
import { Pages } from '../utils/types';

const ButtonAccept: React.FC = () => {
	const user = getUser();

	return (
		<div className="divAcceptButton">
			<button className="acceptButton">
				<div
					onClick={() => {
						user.setPage(Pages.Home);
					}}
				>
					<p className="acceptText">accept change</p>
				</div>
			</button>
		</div>
	);
};

export default ButtonAccept;
