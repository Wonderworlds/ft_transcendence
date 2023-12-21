import React from 'react';
import { useLocation } from 'react-router-dom';
import MatchHistoryInfo from './MatchHistoryInfo.tsx';
import AchievementInfo from './AchievementInfo.tsx';
import FriendsInfo from './FriendsInfo.tsx';


const ActiveInfo: React.FC = () => {

	const location = useLocation();

	return (
		<div className="headerActiveInfo">
			{location.pathname == "/Profile/MatchHistory" &&
				<div className= "divInfo">
					<MatchHistoryInfo score1={5} score2={1} pPWinner='background.png' nameWinner='Benjamin'/>
					<MatchHistoryInfo score1={2} score2={5} pPWinner='background_2.png' nameWinner='J-P'/>
				</div>
			}
			{location.pathname == "/Profile/Achievement" &&
				<div className= "divInfo">
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
					<AchievementInfo name="L'intéressé" description='Gagner sa premiere partie' />
				</div>
			}
			{location.pathname == "/Profile/Friends" &&
				<div className= "divFriendsInfo">
					<div className= "friendList">
						<FriendsInfo pP="background.png" pseudo='Benjamin' status='Offline'/>
						<FriendsInfo pP="background.png" pseudo='Jean' status='Offline'/>
						<FriendsInfo pP="background.png" pseudo='Sam' status='Online'/>
						<FriendsInfo pP="background.png" pseudo='Mathilde' status='Offline'/>
						<FriendsInfo pP="background.png" pseudo='Mathilde' status='Offline'/>
						<FriendsInfo pP="background.png" pseudo='Mathilde' status='Offline'/>
					</div>
					<div className="divfriendButton">
						<p>Add Friend</p>
					</div>
				</div>
			}
			{location.pathname == "/Profile/Leaderboard" &&
				<div className= "divInfo">
					<p>leaderboardInfo</p>
				</div>
			}
		</div>

	);
};

export default ActiveInfo;