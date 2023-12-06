import React from 'react'
import NavBar from '../components/NavBar.tsx';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Parameters: React.FC<void> = () => {

	const location = useLocation();

	return(
		<div className="parameters">
			<div className="divNav">
				<NavBar profilePicture="PP" pseudo="Benjamin"/>
			</div>
			<div className="divParametersTop">
					<h1 className="titleParameter">Parameters</h1>
			</div>
			<div className="divParametersMiddle">
				<div className="divChangeName">
					<div className="changeName">
						<p className="pChangeName">Change Name</p>
						<div className="whiteSpace">
							<input type="text" name="name" id="name" required />
						</div>
					</div>
					<div className="checkBox">
						<p className="doubleAuth">double authentification</p>
						<div className="whiteBox">
							<input type="checkbox"/>
						</div>
					</div>
				</div>
				<div className="divPicture">
					<p className="titlePicture">Picture</p>
				</div>
			</div>
			<div className="divParametersBottom">
				<div className="divAcceptChange">
					<Link to="/Home">
						<p className="acceptChangeText">Accept change</p>
					</Link>
				</div>
				<Link to="/">
						<p className="disconnectText">disconnect</p>
				</Link>
			</div>
		</div>
	);
};

export default Parameters;