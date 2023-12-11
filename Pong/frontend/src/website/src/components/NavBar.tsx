import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import PongTitle from './PongTitle.tsx';
import Play from './Play.tsx';
import Chat from './Chat.tsx';

interface NavBarProps {
	profilePicture: string;
	pseudo: string;
	setState: ()=>void;
}

const NavBar: React.FC<NavBarProps> = ({ profilePicture, pseudo, setState }) => {

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
						<Link to="/Parameters"><p>{profilePicture}</p></Link>
					</div>
					<div className= "navPseudo" /*onClick={() => setPage(Pages.Profile)}*/>
						<p>pseudo</p>
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
