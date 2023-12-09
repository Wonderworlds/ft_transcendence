import React from 'react';
import './styles/pages/index.scss';
// import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import Home from './pages/Home.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import Profile from './pages/Profile.tsx';
import MatchHistory from './pages/MatchHistory.tsx';
import Achievement from './pages/Achievement.tsx';
import Friends from './pages/Friends.tsx';
import Leaderboard from './pages/Leaderboard.tsx';
import Parameters from './pages/Parameters.tsx';


export enum Pages {
	MainPage = 0,
	Home,
	WaitingMatch,
	Profile,
	MatchHistory,
	Achievement,
	Friends,
	Leaderboard,
	Parameters,

}

	const App = () => {
		const [page, setPage] = React.useState<Pages>(Pages.Home);


		function renderSwitch(param: Pages) {
			switch (param) {
				case Pages.MainPage:
					return (<MainPage/>);
				case Pages.Home:
					return (<Home/>);
				case Pages.WaitingMatch:
					return (<WaitingMatch/>);
				case Pages.Profile:
					return (<Profile win={9} loose={1} rank={1}/>);
				case Pages.MatchHistory:
					return (<MatchHistory/>);
				case Pages.Achievement:
					return (<Achievement/>);
				case Pages.Friends:
					return (<Friends/>);
				case Pages.Leaderboard:
					return (<Leaderboard/>);
				case Pages.Parameters:
					return (<Parameters/>);
			}
		}

		return (
		<div className="App">
			{renderSwitch(page)}
			{/* <BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/Home" element={<Home />} />
					<Route path="/WaitingMatch" element={<WaitingMatch />} />
					<Route path="/Profile" element={<Profile />} />
						<Route path="/Profile/MatchHistory" element={<MatchHistory />} />
						<Route path="/Profile/Achievement" element={<Achievement />} />
						<Route path="/Profile/Friends" element={<Friends />} />
						<Route path="/Profile/Leaderboard" element={<Leaderboard />} />
					<Route path="/Parameters" element={<Parameters />} />
				</Routes>
			</BrowserRouter> */}
		</div>
		);
};

export default App;