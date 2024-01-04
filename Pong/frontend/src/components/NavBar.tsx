import PongTitle from './PongTitle.tsx';
import Play from './Play.tsx';
import Chat from './Chat.tsx';
import React from 'react';
import { getUser } from '../context/UserContext.tsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
	const user = getUser();
	const navigate = useNavigate();
	const location = useLocation();

	const playElement = () => {
		return location.pathname.toLowerCase() == '/home' ? (
			<div></div>
		) : (
			<Link to={'/game'}>
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
						navigate('/home');
					}}
				>
					<PongTitle />
				</div>
				{playElement()}
				<div className="navRight">
					<div
						className="navProfilePicture"
						onClick={() => {
							navigate('/stats');
						}}
					>
						<img src={user.ppImg} />
					</div>
					<div
						className="navPseudo"
						onClick={() => {
							navigate('/profile');
						}}
					>
						<p>{user.pseudo}</p>
					</div>
					<div className="navChat" onClick={() => {}}>
						<Chat />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
