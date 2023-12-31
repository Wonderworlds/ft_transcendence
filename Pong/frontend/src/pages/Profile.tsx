import React from 'react';
import NavProfile from '../components/NavProfile.tsx';
import ActiveInfo from '../components/ActiveInfo.tsx';
import NavBar from '../components/NavBar.tsx';
import { TabOption } from '../utils/types.tsx';

interface ProfileProps {
	win: number;
	loose: number;
	rank: number;
}

const Profile: React.FC<ProfileProps> = ({ win, loose, rank }) => {
	const [tab, settab] = React.useState(TabOption.Null);

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
					<NavProfile settab={settab} />
				</div>
				<div className="divActiveInfo">
					<ActiveInfo tab={tab} />
				</div>
			</div>
		</div>
	);
};

export default Profile;
