import React from 'react';
import PongTitle from '../components/PongTitle.tsx';
import LogIn from '../components/LogIn.tsx';
import { User } from '../utils/types.tsx';

interface MainPageProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	setuser: React.Dispatch<React.SetStateAction<any>>;
}

const MainPage: React.FC<MainPageProps> = ({ setpage, setuser }) => {
	return (
		<div className="mainPage">
			<div className="divPongTitleMid">
				<PongTitle />
			</div>
			<div className="divLogInButton">
				<LogIn setpage={setpage} setuser={setuser} />
			</div>
		</div>
	);
};

export default MainPage;
