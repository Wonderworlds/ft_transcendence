import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/pages/index.scss';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(<App />);
