import React from 'react';
import { TabOption } from '../utils/types.tsx';
import MatchHistory from '../pages/MatchHistory.tsx';
import Achievement from '../pages/Achievement.tsx';
import Friends from '../pages/Friends.tsx';

interface ActiveInfoProps {
	tab: TabOption;
}

const ActiveInfo: React.FC<ActiveInfoProps> = ({ tab }) => {
	function whichTab(tab: TabOption) {
		switch (tab) {
			case TabOption.Null:
				break;
			case TabOption.History:
				return (
					<div className="divInfo">
						<MatchHistory />
					</div>
				);
			case TabOption.Achievement:
				return (
					<div className="divInfo">
						<Achievement />
					</div>
				);
			case TabOption.Friend:
				return (
					<div className="divInfo">
						<Friends />
					</div>
				);
			case TabOption.Leaderboard:
				return (
					<div className="divInfo">
						<p>leaderboardInfo</p>
					</div>
				);
		}
	}

	return (
		<div className="headerActiveInfo">
			{whichTab(tab)}
		</div>
	);
};

export default ActiveInfo;
