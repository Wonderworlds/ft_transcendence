import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import Home from './pages/Home.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import Profile from './pages/Profile.tsx';
import Parameters from './pages/Parameters.tsx';
import Chat from './pages/Chat.tsx';
import React from 'react';
import { Pages, Status, User } from './utils/types.tsx';

const App = () => {
	const newuser: User = {
		pseudo: '',
		ppImg: 'vite.svg',
		status: Status.Online,
	};
	const [page, setpage] = React.useState(Pages.Root);
	const [user, setuser] = React.useState(newuser);

	function whichPage(page: Pages) {
		switch (page) {
			case Pages.Root:
				return <MainPage setpage={setpage} setuser={setuser} />;
			case Pages.Home:
				return <Home setpage={setpage} user={user} />;
			case Pages.WaitingMatch:
				return <WaitingMatch setpage={setpage} user={user} />;
			case Pages.Profile:
				return (
					<Profile setpage={setpage} win={9} loose={1} rank={1} user={user} />
				);
			case Pages.Parameter:
				return <Parameters setpage={setpage} user={user} setuser={setuser} />;
			case Pages.Chat:
				return <Chat setpage={setpage} user={user} />;
		}
	}

	return <div className="App">{whichPage(page)}</div>;
};

export default App;
