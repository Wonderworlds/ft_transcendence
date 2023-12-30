import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import { Pages } from '../utils/types.tsx';
import WaitingMatch from './WaitingMatch.tsx';
import Profile from './Profile.tsx';
import Parameters from './Parameters.tsx';
import Chat from './Chat.tsx';
import { ChatWebsocketProvider } from '../context/ChatWebsocketContext.tsx';
import { PongWebsocketProvider } from '../context/PongWebsocketContext.tsx';
import { getUser } from '../context/UserContext.tsx';

const Home: React.FC = () => {
	const user = getUser();

	async function tmpAuth() {
		user.getMatchHistory();
	}

	const homeElement = () => {
		return (
			<div className="home">
				<div className="divNav">
					<NavBar />
				</div>
				<div className="divPlayMid">
					<PlayBig />
				</div>
				<button className="logInButton" onClick={tmpAuth}>
					<p className="logInText">Log In</p>
				</button>
			</div>
		);
	};

	function whichPage(page: Pages) {
		switch (page) {
			case Pages.Home:
				return homeElement();
			case Pages.WaitingMatch:
				return (
					<PongWebsocketProvider>
						<WaitingMatch />
					</PongWebsocketProvider>
				);
			case Pages.Profile:
				return <Profile win={9} loose={1} rank={1} />;
			case Pages.Parameter:
				return <Parameters />;
			case Pages.Chat:
				return (
					<ChatWebsocketProvider>
						<Chat />
					</ChatWebsocketProvider>
				);
		}
	}
	return <>{whichPage(user.page)}</>;
};

export default Home;
