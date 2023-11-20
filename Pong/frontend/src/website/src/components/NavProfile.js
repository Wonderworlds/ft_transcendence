import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavProfile = () => {

	const location = useLocation();
	
	return (

		<div className="headerNavProfile">
			<nav className="navProfile">
				<div>
					<Link to="/Profile/MatchHistory"><p>Match History</p></Link>
				</div>
				<div>
					<Link to="/Profile/Achievement"><p>Achievement</p></Link>
				</div>
				<div>
					<Link to="/Profile/Friends"><p>Friends</p></Link>
				</div>
				<div>
					<Link to="/Profile/Leaderboard"><p>Leaderboard</p></Link>
				</div>
			</nav>			
		</div>
	);
};

export default NavProfile;