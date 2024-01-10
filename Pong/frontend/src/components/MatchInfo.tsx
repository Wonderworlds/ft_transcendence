import React from 'react';
import { MatchDto } from '../utils/dtos';
import { GameType } from '../utils/types';

interface MatchInfoProps {
	match: MatchDto;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ match }) => {
	const gameTypeColor = () => {
		switch (match.gameType) {
			case GameType.classic:
				return 'orange';
			case GameType.multiplayer:
				return 'blue';
			case GameType.tournament:
				return 'yellow';
		}
	};
	return (
		<div className={match.won ? 'divMatchInfoWon' : 'divMatchInfoLost'}>
			<div className="divMatchInfo">
				{match.won ? <p>&#x1F3C6;</p> : <p>'&#x1F44E;'</p>}
				<p style={{ color: gameTypeColor() }}>{match.gameType}</p>
				<p>
					{match.P1} VS {match.P2}
				</p>
				<p>
					Score : {match.scoreP1} / {match.scoreP2}
				</p>
				{match.scoreP1 > match.scoreP2 ? <p>Winner: {match.P1}</p> : <p>Winner: {match.P2}</p>}
			</div>
		</div>
	);
};
export default MatchInfo;
