import React from 'react';
import { useLocation } from 'react-router-dom';


const ActiveInfo = () => {

	const location = useLocation();

	return (
		<div>
			{location.pathname == "/Profile/MatchHistory" &&
				<div className= "matchHistoryInfo">
					<p>matchHistoryInfo</p>
				</div>
			}
			{location.pathname == "/Profile/Achievement" &&
				<div className= "achievementInfo">
					<p>achievementInfo</p>
				</div>
			}
			{location.pathname == "/Profile/Friends" &&
				<div className= "friendsInfo">
					<p>friendsInfo</p>
				</div>
			}
			{location.pathname == "/Profile/Leaderboard" &&
				<div className= "leaderboardInfo">
					<p>leaderboardInfo</p>
				</div>
			}
		</div>

	);
};

export default ActiveInfo;