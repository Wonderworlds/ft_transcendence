import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { AxiosContextProvider } from './context/AxiosContext.tsx';

const App = () => {
	return (
		<div className="App">
			<AxiosContextProvider>
				<UserContextProvider>
					<MainPage />
				</UserContextProvider>
			</AxiosContextProvider>
		</div>
	);
};

export default App;
