import React from 'react';
import NavBar from '../components/NavBar.js';
import NavProfile from '../components/NavProfile.js';
import { useLocation } from 'react-router-dom';
import ActiveInfo from '../components/ActiveInfo.js';


const Profile = ({win, loose, rank}) => {

	const location = useLocation();

	return (
		<div className="profile">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="top">
				<div className="divRatio">
					<p className="win">Win: {win}</p>
					<p className="loose">Loose: {loose}</p>
				</div>
				<div className="divRank">
					<p className="rank">Rank: {rank}</p>
				</div>
			</div>
			<div className="bottom">
				<div className="divNavProfile">
					<NavProfile />
				</div>
				<div className="divActiveInfo">
					<ActiveInfo />
				</div>
			</div>
		</div>
	);
};

export default Profile;