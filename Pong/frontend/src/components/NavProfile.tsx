import React from 'react';
import { TabOption } from '../pages/Profile';

interface NavProfileProps {
	settab: React.Dispatch<React.SetStateAction<any>>;
}

const NavProfile: React.FC<NavProfileProps> = ({ settab }) => {
	return (
		<div className="headerNavProfile">
			<nav className="navProfile">
				<div>
					<div
						onClick={() => {
							settab(TabOption.History);
						}}
					>
						<p>Match History</p>
					</div>
				</div>
				<div>
					<div
						onClick={() => {
							settab(TabOption.Achievement);
						}}
					>
						<p>Achievement</p>
					</div>
				</div>
				<div>
					<div
						onClick={() => {
							settab(TabOption.Friend);
						}}
					>
						<p>Friends</p>
					</div>
				</div>
				<div>
					<div
						onClick={() => {
							settab(TabOption.Leaderboard);
						}}
					>
						<p>Leaderboard</p>
					</div>
				</div>
			</nav>
		</div>
	);
};

export default NavProfile;
