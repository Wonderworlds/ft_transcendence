import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import { Pages } from '../utils/types.tsx';
import WaitingMatch from './WaitingMatch.tsx';
import Profile from './Profile.tsx';
import Parameters from './Parameters.tsx';
import Chat from './Chat.tsx';
import { getUser } from '../context/UserContext.tsx';
import { WebsocketProvider } from '../context/WebsocketContext.tsx';

const Home: React.FC = () => {
	const user = getUser();

	const homeElement = () => {
		return (
			<div className="home">
				<div className="divNav">
					<NavBar />
				</div>
				<div className="divPlayMid">
					<PlayBig />
				</div>
			</div>
		);
	};

	function whichPage(page: Pages) {
		switch (page) {
			case Pages.Home:
				return homeElement();
			case Pages.WaitingMatch:
				return (
					<WebsocketProvider>
						<WaitingMatch />
					</WebsocketProvider>
				);
			case Pages.Profile:
				return <Profile win={9} loose={1} rank={1} />;
			case Pages.Parameter:
				return <Parameters />;
			case Pages.Chat:
				return <Chat />;
		}
	}
	return <>{whichPage(user.page)}</>;
};

export default Home;
