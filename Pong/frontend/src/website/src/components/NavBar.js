import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PongTitle from './PongTitle';
import Play from './Play';
import Chat from './Chat';

const NavBar = ({ profilePicture, pseudo }) => {

	const location = useLocation();

	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div className= "navPongTitle">
					<Link to="/Home"><PongTitle/></Link>
				</div>
				{location.pathname !== "/Home" &&
					<div className= "navPlay">
						<Link to="/WaitingMatch"><Play /></Link>
					</div>
				}
				<div className="navRight">
					<div className="navProfilePicture">
						<Link to="/Parameters"><p>{profilePicture}PP</p></Link>
					</div>
					<div className= "navPseudo">
						<Link to="/Profile"><p>{pseudo}Benjamin</p></Link>
					</div>
					<div className= "navChat">
						<Link to="/Chat"><Chat /></Link>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
