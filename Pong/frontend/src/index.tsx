import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/pages/index.scss';
import Pong from './pages/Pong.tsx';
import { WebsocketProvider } from './context/WebsocketContext.tsx';
import WaitingMatch from './pages/WaitingMatch.tsx';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<WebsocketProvider>
		<WaitingMatch />
	</WebsocketProvider>
);
