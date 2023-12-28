import './styles/pages/index.scss';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage.tsx';
import Home from './pages/Home.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import Profile from './pages/Profile.tsx';
import Parameters from './pages/Parameters.tsx';
import Chat from './pages/Chat.tsx';
import Rooms from './pages/Rooms.tsx';

const App = () => {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/Home" element={<Home />} />
					<Route path="/WaitingMatch" element={<WaitingMatch />} />
					<Route
						path="/Profile"
						element={<Profile win={9} loose={1} rank={1} />}
					/>
					<Route path="/Parameters" element={<Parameters />} />
					<Route path="/Chat" element={<Chat />} />
					<Route path="/Rooms" element={<Rooms />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
