import React from 'react';
import { MatchDto } from '../utils/dtos';
import { GameType } from '../utils/types';
import MatchInfo from './MatchInfo';

interface ProfilePlayerProps {
	pseudo: string;
	inviteGame?: (pseudo: string) => void;
	deleteFriend?: (pseudo: string) => void;
}

const ProfilePlayer: React.FC<ProfilePlayerProps> = ({ pseudo, inviteGame, deleteFriend }) => {
	const [winRate, setWinRate] = React.useState(0);
	const [wins, setWins] = React.useState(0);
	const [loses, setLoses] = React.useState(0);
	const match = {
		scoreP1: 9,
		scoreP2: 2,
		P1: 'mauguin',
		P2: 'albert',
		won: true,
		gameType: GameType.classic,
	} as MatchDto;
	const match2 = {
		scoreP1: 9,
		scoreP2: 2,
		P2: 'mauguin',
		P1: 'sacha',
		won: false,
		gameType: GameType.multiplayer,
	} as MatchDto;

	const matchs: MatchDto[] = [];
	for (let i = 0; i < 12; i++) {
		matchs.push(match);
		matchs.push(match2);
	}

	function calculateStats(matchs: MatchDto[]) {
		let wins = 0;
		let loses = 0;
		matchs.forEach((match) => {
			if (match.won) wins++;
			else loses++;
		});
		setWins(wins);
		setLoses(loses);
		setWinRate((wins / (wins + loses)) * 100);
	}
	React.useEffect(() => {
		calculateStats(matchs);
	}, []);

	const hue = winRate.toString(10);
	const hsl = `hsl(${hue}, 87%, 45%)`;
	console.log(hsl);
	return (
		<div className="divProfilePlayer">
			<p>{pseudo}</p>
			<div className="divProfilePlayerStats">
				<p style={{ color: hsl }}>Winrate: {winRate}%</p>
				<p style={{ color: '#06a52b' }}>Wins: {wins}</p>
				<p style={{ color: '#8a1111' }}>Loses: {loses}</p>
			</div>
			<div className="divProfilePlayerMatchs">
				{matchs.map((match, index) => {
					return <MatchInfo key={index} match={match} />;
				})}
			</div>
			{inviteGame && deleteFriend ? (
				<div className="divProfilePlayerButton">
					<div className="divProfilePlayerButtonInvite">
						<button
							onClick={() => {
								inviteGame(pseudo);
							}}
						>
							Game ?
						</button>
					</div>
					<div className="divProfilePlayerButtonDelete">
						<button
							onClick={() => {
								deleteFriend(pseudo);
							}}
						>
							UnFriend
						</button>
					</div>
				</div>
			) : null}
		</div>
	);
};

export default ProfilePlayer;
