import React from 'react';
import PongTitle from '../components/PongTitle.tsx';
import LogIn from '../components/LogIn.tsx';

interface MainPageProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const MainPage: React.FC<MainPageProps> = ({ setpage }) => {
	return (
		<div className="mainPage">
			<div className="divPongTitleMid">
				<PongTitle />
			</div>
			<div className="divLogInButton">
				<LogIn setpage={setpage} />
			</div>
		</div>
	);
};

export default MainPage;
