import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.tsx';
import PutPicture from '../components/PutPicture.tsx';
import UpdateUser from '../components/UpdateUser.tsx';
import { Pages } from '../utils/types.tsx';

const Settings: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="headerProfile">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divParameters">
				<div className="divParametersTop">
					<h1>Parameters</h1>
				</div>
				<div className="divParametersMiddle">
					<UpdateUser />
					<PutPicture />
				</div>
				<div className="divParametersBottom">
					<button
						onClick={() => {
							navigate(Pages.Root);
							window.location.reload();
						}}
					>
						<p>Disconnect</p>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
