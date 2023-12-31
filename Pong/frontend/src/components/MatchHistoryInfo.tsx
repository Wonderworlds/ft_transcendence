import React from 'react';
import { Match } from '../utils/types';

interface MatchHistoryProps {
	match: Match;
}

const MatchHistoryInfo: React.FC<MatchHistoryProps> = ({match}) => {

	function whoWin(match: Match) {
		if (match.myScore - match.adversaryScore === 0) {
			return "Nul";
		} else if (match.myScore - match.adversaryScore > 0) {
			return "Victory";
		} else {
			return "Defeat";
		}
	}

	return (
		<div className="headerMatchHistoryInfo">
			<div className="InfoBox">
				<p className="p1">
					{match.me.ppImg} {match.me.pseudo} {match.myScore} - {match.adversaryScore} {match.adversary.pseudo} {match.adversary.ppImg}
				</p>
				<p className="p2">
					{whoWin(match)}
				</p>
			</div>
		</div>
	);
};

export default MatchHistoryInfo;