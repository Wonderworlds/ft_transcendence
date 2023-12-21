import React from 'react';
import PongTitle from '../components/PongTitle.tsx';
import LogIn from '../components/LogIn.tsx';

const MainPage: React.FC = () => {
	return (
		<div className="mainPage">
			<div className="divPongTitleMid">
				<PongTitle />
			</div>
			<div className="divLogInButton">
				<LogIn />
			</div>
		</div>
	);
};

export default MainPage;