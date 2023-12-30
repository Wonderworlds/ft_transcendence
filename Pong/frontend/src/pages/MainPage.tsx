import React from 'react';
import PongTitle from '../components/PongTitle.tsx';
import LogIn from '../components/LogIn.tsx';
import { getUser } from '../context/UserContext.tsx';
import { WebsocketProvider } from '../context/WebsocketContext.tsx';
import Home from './Home.tsx';

const MainPage: React.FC = () => {
	const user = getUser();
	console.log(user);

	const mainPageELement = () => {
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

	return (
		<>
			{user.loggedIn ? (
				<WebsocketProvider>
					<Home />
				</WebsocketProvider>
			) : (
				mainPageELement()
			)}
		</>
	);
};

export default MainPage;
