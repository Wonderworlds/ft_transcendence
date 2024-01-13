import React from 'react';
import { getUser } from '../context/UserContext';
import { MatchDto } from '../utils/dtos';
import { GameType } from '../utils/types';

interface MatchInfoProps {
	match: MatchDto;
}

const MatchInfo: React.FC<MatchInfoProps> = ({ match }) => {
	const user = getUser();
	const won = match.winner === user.pseudo;
	const gameTypeColor = () => {
		switch (match.gameType) {
			case GameType.classicLocal:
				return 'yellow';
			case GameType.multiplayerOnline:
				return 'blue';
			case GameType.tournamentLocal:
				return 'orange';
			case GameType.tournamentOnline:
				return 'orange';
			case GameType.classicOnline:
				return 'yellow';
		}
	};
	const newDate = new Date(match.date);
	const date = newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString();
	const multiplayerElement = () => {
		return (
			<div className={won ? 'divMatchInfoWon' : 'divMatchInfoLost'}>
				<div className="divMatchInfo">
					{won ? <p>&#x1F3C6;</p> : <p>'&#x1F44E;'</p>}
					<div className="divDateMatch">
						<p style={{ color: gameTypeColor() }}>{match.gameType}</p>
						<p>{date}</p>
					</div>
					<div className="divDateMatch">
						<p>
							{match.p1} VS {match.p2}
						</p>
						<p>
							{match.p3} VS {match.p4}
						</p>
					</div>
					<div className="divScoreMatch">
						<p>Score: </p>
						<div className="divDateMatch">
							<p>
								{match.scoreP1} / {match.scoreP2}
							</p>
							<p>
								{match.scoreP3} / {match.scoreP4}
							</p>
						</div>
					</div>
					<p>Winner: {match.winner}</p>
				</div>
			</div>
		);
	};
	const classicElement = () => {
		return (
			<div className={won ? 'divMatchInfoWon' : 'divMatchInfoLost'}>
				<div className="divMatchInfo">
					{won ? <p>&#x1F3C6;</p> : <p>'&#x1F44E;'</p>}
					<div className="divDateMatch">
						<p style={{ color: gameTypeColor() }}>{match.gameType}</p>
						<p>{date}</p>
					</div>
					<p>
						{match.p1} VS {match.p2}
					</p>
					<p>
						Score : {match.scoreP1} / {match.scoreP2}
					</p>
					<p>Winner: {match.winner}</p>
				</div>
			</div>
		);
	};

	return <>{!match.p3 ? classicElement() : multiplayerElement()}</>;
};
export default MatchInfo;
