import React from 'react';
import PongTitle from '../components/PongTitle.tsx';
import LogIn from '../components/LogIn.tsx';

const MainPage = () => {
	return (
		<div className="mainPage">
			<div className="divPongTitleMid">
				<PongTitle />
			</div>
			<LogIn />
		</div>
	);
};

export default MainPage;