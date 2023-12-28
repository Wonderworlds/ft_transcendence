import React from 'react';
import AchievementInfo from '../components/AchievementInfo.tsx';

const Achievement: React.FC = () => {
	let achievementList = new Array<{ id: number; key: string; value: string }>();

	achievementList.push({
		id: 1,
		value: 'Play your first match',
		key: 'First step',
	});
	achievementList.push({
		id: 2,
		key: 'One foot in the race',
		value: 'Win your first game',
	});
	achievementList.push({
		id: 3,
		value: 'Add your first friend',
		key: 'The sociable',
	});

	const achievementsElement: any = achievementList.map((item) => {
		return (
			<AchievementInfo key={item.id} name={item.key} description={item.value} />
		);
	});

	return <>{achievementsElement}</>;
};

export default Achievement;
