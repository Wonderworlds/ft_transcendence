import React from 'react';
import MatchHistoryInfo from './MatchHistoryInfo.tsx';
import FriendsInfo from './FriendsInfo.tsx';
import Achievement from '../pages/Achievement.tsx';
import { TabOption } from '../pages/Profile.tsx';
import MatchHistory from '../pages/MatchHistory.tsx';

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
						<p>history</p>
						{/* <MatchHistory /> */}
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
						<p>friendslist</p>
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
			{/* 
				<div className="divInfo">
					<MatchHistoryInfo
						score1={5}
						score2={1}
						pPWinner="background.png"
						nameWinner="Benjamin"
					/>
					<MatchHistoryInfo
						score1={2}
						score2={5}
						pPWinner="background_2.png"
						nameWinner="J-P"
					/>
				</div>
			{location.pathname == '/Profile/Achievement' && (
				<div className="divInfo">
					<Achievement />
				</div>
			)}
			{location.pathname == '/Profile/Friends' && (
				<div className="divFriendsInfo">
					<div className="friendList">
						<FriendsInfo
							pP="background.png"
							pseudo="Benjamin"
							status="Offline"
						/>
						<FriendsInfo pP="background.png" pseudo="Jean" status="Offline" />
						<FriendsInfo pP="background.png" pseudo="Sam" status="Online" />
						<FriendsInfo
							pP="background.png"
							pseudo="Mathilde"
							status="Offline"
						/>
						<FriendsInfo
							pP="background.png"
							pseudo="Mathilde"
							status="Offline"
						/>
						<FriendsInfo
							pP="background.png"
							pseudo="Mathilde"
							status="Offline"
						/>
					</div>
					<div className="divfriendButton">
						<p>Add Friend</p>
					</div>
				</div>
			)}
			{location.pathname == '/Profile/Leaderboard' && (
				<div className="divInfo">
					<p>leaderboardInfo</p>
				</div>
			)} */}
		</div>
	);
};

export default ActiveInfo;
