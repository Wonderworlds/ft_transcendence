import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { WebsocketProvider, socket } from './context/WebsocketContext';
import { Websocket } from './components/Websocket';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<WebsocketProvider value={socket}>
				<Websocket />
			</WebsocketProvider>
		</>
	);
}

export default App;
