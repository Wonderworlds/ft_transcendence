import './styles/pages/index.scss';
import MainPage from './pages/MainPage.tsx';
import { UserContextProvider } from './context/UserContext.tsx';

const App = () => {
	return (
		<div className="App">
			<UserContextProvider>
				<MainPage />
			</UserContextProvider>
		</div>
	);
};

export default App;
