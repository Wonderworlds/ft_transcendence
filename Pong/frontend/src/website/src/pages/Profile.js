import React from 'react';
import NavBar from '../components/NavBar.js';

const Profile = ({win, loose, rank}) => {
	return (
		<div className="profile">
			<NavBar />
			<div className="top">
				<div className="divRatio">
					<p className="win">Win: {win}</p>
					<p className="loose">Loose: {loose}</p>
				</div>
				<div className="divRank">
					<p className="rank">Rank: {rank}</p>
				</div>
			</div>
		</div>
	);
};

export default Profile;