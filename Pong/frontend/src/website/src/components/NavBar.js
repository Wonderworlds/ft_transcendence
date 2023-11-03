import React from 'react';
import { Link } from 'react-router-dom';
import PongTitle from './PongTitle';
import Play from './Play';
import Chat from './Chat';

const NavBar = ({ pseudo }) => {
	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<Link to="/"><PongTitle /></Link>
				<Link to="/WaitingMatch"><Play /></Link>
				<p>{pseudo}</p>
				<Link to="/Chat"><Chat /></Link>
			</nav>
		</header>
	);
};

export default NavBar;