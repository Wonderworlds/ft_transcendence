import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import { Pages } from '../utils/types.tsx';
import WaitingMatch from './WaitingMatch.tsx';
import Profile from './Profile.tsx';
import Parameters from './Parameters.tsx';
import Chat from './Chat.tsx';

const Home: React.FC = () => {
	const [page, setpage] = React.useState(Pages.Home);

	const homeElement = () => {
		return (
			<div className="home">
				<div className="divNav">
					<NavBar setpage={setpage} />
				</div>
				<div className="divPlayMid">
					<PlayBig setpage={setpage} />
				</div>
			</div>
		);
	};

	function whichPage(page: Pages) {
		switch (page) {
			case Pages.Home:
				return homeElement();
			case Pages.WaitingMatch:
				return <WaitingMatch setpage={setpage} />;
			case Pages.Profile:
				return <Profile setpage={setpage} win={9} loose={1} rank={1} />;
			case Pages.Parameter:
				return <Parameters setpage={setpage} />;
			case Pages.Chat:
				return <Chat setpage={setpage} />;
		}
	}
	return <>{whichPage(page)}</>;
};

export default Home;
