import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AxiosContextProvider } from './context/AxiosContext.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { WebsocketProvider } from './context/WebsocketContext.tsx';
import Default from './pages/Default.tsx';
import Home from './pages/Home.tsx';
import MainPage from './pages/MainPage.tsx';
import Pong from './pages/Pong.tsx';
import Settings from './pages/Profile.tsx';
import Stats from './pages/Stats.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import './styles/pages/index.scss';
import { Pages } from './utils/types.tsx';

const App = () => {
	return (
		<div className="App">
			<AxiosContextProvider>
				<BrowserRouter>
					<UserContextProvider>
						<WebsocketProvider>
							<Routes>
								<Route path={Pages.Root} element={<MainPage />} />
								<Route path={Pages.Home} element={<Home />} />
								<Route path={Pages.Settings} element={<Settings />} />
								<Route path={Pages.Stats} element={<Stats />} />
								<Route path={Pages.WaitingMatch} element={<WaitingMatch />} />
								<Route path={Pages.Pong} element={<Pong />} />
								<Route path={Pages.Default} element={<Default />} />
							</Routes>
						</WebsocketProvider>
					</UserContextProvider>
				</BrowserRouter>
			</AxiosContextProvider>
		</div>
	);
};

export default App;
