import React from 'react';
import ActiveInfo from '../components/ActiveInfo.tsx';
import NavBar from '../components/NavBar.tsx';
import NavProfile from '../components/NavProfile.tsx';
import { TabOption } from '../utils/types.tsx';

const Stats: React.FC = () => {
	const [tab, setTab] = React.useState(TabOption.Friend);
	const values = Object.values(TabOption);

	return (
		<div className="stats">
			<NavBar />
			<div className="divProfile">
				<div className="divTopTitle">
					<h1>Profile</h1>
				</div>
				<div className="divMiddleButton">
					<NavProfile setTab={setTab} tab={tab} tabOptions={values} />
				</div>
				<div className="divBottomInfo">
					<ActiveInfo tab={tab} />
				</div>
			</div>
		</div>
	);
};

export default Stats;
