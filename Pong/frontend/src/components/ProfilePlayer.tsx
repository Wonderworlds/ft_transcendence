import React from 'react';
import { getAxios } from '../context/AxiosContext';
import { MatchDto } from '../utils/dtos';
import MatchInfo from './MatchInfo';

interface ProfilePlayerProps {
	pseudo: string;
	isClicked: string;
	inviteGame?: (pseudo: string) => void;
	deleteFriend?: (pseudo: string) => void;
}

const ProfilePlayer: React.FC<ProfilePlayerProps> = ({
	pseudo,
	inviteGame,
	deleteFriend,
	isClicked,
}) => {
	const axios = getAxios();
	const [winRate, setWinRate] = React.useState<string>('0');
	const [wins, setWins] = React.useState(0);
	const [loses, setLoses] = React.useState(0);
	const [matchs, setMatchs] = React.useState<MatchDto[]>([]);

	function calculateStats(matchs: MatchDto[]) {
		let wins = 0;
		let loses = 0;
		matchs.forEach((match) => {
			if (match.won) wins++;
			else loses++;
		});
		setWins(wins);
		setLoses(loses);
		if (wins + loses === 0) return setWinRate('0');
		const winRate: number = (wins / (wins + loses)) * 100;
		setWinRate(winRate.toFixed(2));
	}
	React.useEffect(() => {
		if (!axios.auth.token) return;
		axios.client
			.get(`users/${pseudo}/matchs`)
			.then((res: any) => {
				setMatchs(res.data);
				calculateStats(res.data);
			})
			.catch((err: any) => {
				alert(err.response?.data?.message);
			});
	}, [axios.ready, isClicked]);

	const hsl = `hsl(${winRate}, 87%, 45%)`;
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
