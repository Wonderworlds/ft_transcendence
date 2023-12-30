import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import { Pages } from '../utils/types.tsx';
import WaitingMatch from './WaitingMatch.tsx';
import Profile from './Profile.tsx';
import Parameters from './Parameters.tsx';
import Chat from './Chat.tsx';
import { getUser } from '../context/UserContext.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import { ChatWebsocketProvider } from '../context/ChatWebsocketContext.tsx';
import { PongWebsocketProvider } from '../context/PongWebsocketContext copy.tsx';

const Home: React.FC = () => {
	const user = getUser();
	const [page, setpage] = React.useState(Pages.Home);
	const [pseudo, setpseudo] = React.useState('');

	const tmpAuth = () => {
		if (pseudo === '') return;
		console.log('click');
	};

	const handleChange = (event: any) => {
		setpseudo(event.target.value);
	};
	const homeElement = () => {
		return (
			<div className="home">
				<div className="divNav">
					<NavBar setpage={setpage} />
				</div>
				<div className="divPlayMid">
					<PlayBig setpage={setpage} />
				</div>
				<div>
					<input
						type="text"
						name="pseudo"
						placeholder="pseudo"
						value={pseudo}
						onChange={handleChange}
					/>
					<button className="logInButton" onClick={tmpAuth}>
						<p className="logInText">Log In</p>
					</button>
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
					<PongWebsocketProvider>
						<WaitingMatch setpage={setpage} />
					</PongWebsocketProvider>
				);
			case Pages.Profile:
				return <Profile setpage={setpage} win={9} loose={1} rank={1} />;
			case Pages.Parameter:
				return <Parameters setpage={setpage} />;
			case Pages.Chat:
				return (
					<ChatWebsocketProvider>
						<Chat setpage={setpage} />
					</ChatWebsocketProvider>
				);
		}
	}
	return <>{whichPage(page)}</>;
};

export default Home;
