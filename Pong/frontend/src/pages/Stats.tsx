import React from 'react';
import NavProfile from '../components/NavProfile.tsx';
import ActiveInfo from '../components/ActiveInfo.tsx';
import NavBar from '../components/NavBar.tsx';
import { TabOption } from '../utils/types.tsx';

const Stats: React.FC = () => {
	const [tab, settab] = React.useState(TabOption.Null);

	return (
		<div className="stats">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="top">
				<div className="divRatio">
					<p className="win">Win: 7</p>
					<p className="loose">Loose: 7</p>
				</div>
				<div className="divRank">
					<p className="rank">Rank: Silver</p>
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

export default Stats;
