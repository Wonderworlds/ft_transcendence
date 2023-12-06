import React from 'react';
import './styles/pages/index.scss';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MainPage from './pages/MainPage';
import Home from './pages/Home';
import WaitingMatch from './pages/WaitingMatch';
import Profile from './pages/Profile.tsx';
import MatchHistory from './pages/MatchHistory';
import Achievement from './pages/Achievement';
import Friends from './pages/Friends';
import Leaderboard from './pages/Leaderboard';
import Parameters from './pages/Parameters.tsx';

	
	const App = () => {
		return (
		<div className="App">
			<BrowserRouter>
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
			</BrowserRouter>
		</div>
		);
};

export default App;