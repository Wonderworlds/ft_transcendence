import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import Home from './pages/Home.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import Profile from './pages/Profile.tsx';
import Parameters from './pages/Parameters.tsx';
import Chat from './pages/Chat.tsx';
import React from 'react';
import { Pages } from './utils/types.tsx';
import { WebsocketProvider } from './context/WebsocketContext.tsx';
import { UserContextProvider } from './context/UserContext.tsx';

const App = () => {
	const [page, setpage] = React.useState(Pages.Root);

	console.log('app');
	function whichPage(page: Pages) {
		switch (page) {
			case Pages.Root:
				return <MainPage setpage={setpage} />;
			case Pages.Home:
				return (
					<WebsocketProvider>
						<Home setpage={setpage} />;
					</WebsocketProvider>
				);
			case Pages.WaitingMatch:
				return (
					<WebsocketProvider>
						<WaitingMatch setpage={setpage} />
					</WebsocketProvider>
				);
			case Pages.Profile:
				return (
					<WebsocketProvider>
						<Profile setpage={setpage} win={9} loose={1} rank={1} />
					</WebsocketProvider>
				);
			case Pages.Parameter:
				return (
					<WebsocketProvider>
						<Parameters setpage={setpage} />;
					</WebsocketProvider>
				);
			case Pages.Chat:
				return (
					<WebsocketProvider>
						<Chat setpage={setpage} />
					</WebsocketProvider>
				);
		}
	}

	return (
		<div className="App">
			<UserContextProvider>{whichPage(page)}</UserContextProvider>
		</div>
	);
};

export default App;
