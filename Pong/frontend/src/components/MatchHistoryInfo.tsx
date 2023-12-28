import React from 'react';

interface MatchHistoryProps {
	score1: number;
	score2: number;
	pPWinner: string;
	nameWinner: string;
}

const MatchHistoryInfo: React.FC<MatchHistoryProps> = ({score1, score2, pPWinner, nameWinner}) => {
	return (
		<div className="headerMatchHistoryInfo">
			<div className="InfoBox">
				<p className="p1">
					{score1} - {score2} : {pPWinner} {nameWinner}
				</p>
				<p className="p2">
					Victory/Defeat {/* Conditionnel selon score  if first(me) > second = winner else looser*/}
				</p>
			</div>
		</div>
	);
};

export default MatchHistoryInfo;