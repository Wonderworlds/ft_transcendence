import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getAxios } from './context/AxiosContext.tsx';
import { GameContextProvider } from './context/GameContext.tsx';
import ProtectedRoute from './context/PrivateRoute.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { WebsocketProvider } from './context/WebsocketContext.tsx';
import Default from './pages/Default.tsx';
import Game from './pages/Game.tsx';
import Home from './pages/Home.tsx';
import MainPage from './pages/MainPage.tsx';
import Settings from './pages/Settings.tsx';
import Stats from './pages/Stats.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';
import './styles/pages/index.scss';
import { Pages } from './utils/types.tsx';

const App = () => {
	const axios = getAxios().auth;
	let isAuthenticated = false;
	if (axios) isAuthenticated = axios.token ? true : false;
	return (
		<div className="App">
			<BrowserRouter>
				<UserContextProvider>
					<WebsocketProvider>
						<Routes>
							<Route path={Pages.Root} element={<MainPage />} />
							<Route
								path={Pages.Home}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={<Home />}
									/>
								}
							/>
							<Route
								path={Pages.Settings}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={<Settings />}
									/>
								}
							/>
							<Route
								path={Pages.Stats}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={<Stats />}
									/>
								}
							/>
							<Route
								path={Pages.WaitingMatch}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={<WaitingMatch />}
									/>
								}
							/>
							<Route
								path={Pages.Pong}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={
											<GameContextProvider>
												<Game />
											</GameContextProvider>
										}
									/>
								}
							/>
							<Route
								path={Pages.Default}
								element={
									<ProtectedRoute
										isAuthenticated={isAuthenticated}
										authenticationPath={Pages.Root}
										outlet={<Default />}
									/>
								}
							/>
						</Routes>
					</WebsocketProvider>
				</UserContextProvider>
			</BrowserRouter>
		</div>
	);
};

export default App;
