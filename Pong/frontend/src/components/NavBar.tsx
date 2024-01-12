import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../context/UserContext.tsx';
import { Pages } from '../utils/types.tsx';
import Play from './Play.tsx';
import PongTitle from './PongTitle.tsx';

const NavBar: React.FC = () => {
	const user = getUser();
	const navigate = useNavigate();
	const location = useLocation();

	const playElement = () => {
		return location.pathname.toLowerCase() == '/home' ? (
			<div></div>
		) : (
			<Link to={Pages.WaitingMatch}>
				<div className="navPlay">
					<Play />
				</div>
			</Link>
		);
	};

	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div
					className="navPongTitle"
					onClick={() => {
						navigate(Pages.Home);
					}}
				>
					<PongTitle />
				</div>
				{playElement()}
				<div className="navRight">
					<div
						className="navProfilePicture"
						onClick={() => {
							navigate(Pages.Stats);
						}}
					>
						<img src={user.ppImg} />
					</div>
					<div
						className="navPseudo"
						onClick={() => {
							navigate(Pages.Settings);
						}}
					>
						<p>{user.pseudo}</p>
					</div>
					<div
						className="gg-log-off"
						onClick={() => {
							navigate(Pages.Root);
						}}
					></div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
