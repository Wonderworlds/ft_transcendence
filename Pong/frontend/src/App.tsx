import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { AxiosContextProvider } from './context/AxiosContext.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Parameters from './pages/Parameters.tsx';
import Profile from './pages/Profile.tsx';
import Default from './pages/Default.tsx';
import Pong from './pages/Pong.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import { GameSocketProvider } from './context/GameSocketContext.tsx';

const App = () => {
	return (
		<div className="App">
			<AxiosContextProvider>
				<UserContextProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<MainPage />} />
							<Route path="/home" element={<Home />} />
							<Route path="/profile" element={<Parameters />} />
							<Route path="/stats" element={<Profile />} />
							<Route
								path="/game"
								element={
									<GameSocketProvider>
										<WaitingMatch />
									</GameSocketProvider>
								}
							/>
							<Route path="/pong" element={<Pong room={''} />} />
							<Route path="/*" element={<Default />} />
						</Routes>
					</BrowserRouter>
				</UserContextProvider>
			</AxiosContextProvider>
		</div>
	);
};

export default App;
