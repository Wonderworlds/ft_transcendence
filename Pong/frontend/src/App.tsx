import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { AxiosContextProvider } from './context/AxiosContext.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Stats from './pages/Stats.tsx';
import Settings from './pages/Profile.tsx';
import Default from './pages/Default.tsx';
import Pong from './pages/Pong.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import { GameSocketProvider } from './context/GameSocketContext.tsx';
import { Pages } from './utils/types.tsx';

const App = () => {
	return (
		<div className="App">
			<AxiosContextProvider>
				<BrowserRouter>
					<UserContextProvider>
						<Routes>
							<Route path={Pages.Root} element={<MainPage />} />
							<Route path={Pages.Home} element={<Home />} />
							<Route path={Pages.Settings} element={<Settings />} />
							<Route path={Pages.Stats} element={<Stats />} />
							<Route
								path={Pages.WaitingMatch}
								element={
									<GameSocketProvider>
										<WaitingMatch />
									</GameSocketProvider>
								}
							/>
							<Route path={Pages.Pong} element={<Pong room={''} />} />
							<Route path={Pages.Default} element={<Default />} />
						</Routes>
					</UserContextProvider>
				</BrowserRouter>
			</AxiosContextProvider>
		</div>
	);
};

export default App;
