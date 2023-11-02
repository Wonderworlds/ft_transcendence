import React from 'react';
import PongTitle from '../components/PongTitle';
import LogIn from '../components/LogIn';
import '../styles/pages/_home.scss';

const Home = () => {
	return (
		<div className="home">
			<div className="divPongTitleMid">
				<PongTitle />
			</div>
			<LogIn />
		</div>
	);
};

export default Home;