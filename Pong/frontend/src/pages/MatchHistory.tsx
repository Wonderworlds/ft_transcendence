import React from 'react';
import MatchHistoryInfo from '../components/MatchHistoryInfo.tsx';
import { Match, User } from '../utils/types.tsx';




const MatchHistory: React.FC = () => {
	let matchHistoryList = new Array<{match: Match}>();
	let p1 = {pseudo:"Ben", ppImg: "b.png", status: "Online"} as User;
	let p2 = {pseudo:"Jean", ppImg: "j.png", status: "Offline"} as User;

	let m1 = {me: p1, adversary: p2, myScore: 5, adversaryScore: 4} as Match;
	let m2 = {me: p1, adversary: p2, myScore: 4, adversaryScore: 5} as Match;
	let m3 = {me: p1, adversary: p2, myScore: 4, adversaryScore: 4} as Match;
	
	matchHistoryList.push({
		match: m1
	});
	matchHistoryList.push({
		match: m2
	});
	matchHistoryList.push({
		match: m3
	});

	const matchHistoryElement: any = matchHistoryList.map((item) => {
		return (
			<MatchHistoryInfo match={item.match} />
		);
	});

	return <>{matchHistoryElement}</>;
};

export default MatchHistory;