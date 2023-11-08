import React from 'react';
import NavBar from '../components/NavBar.js';
import PlayBig from '../components/PlayBig.js';

const Home = () => {
	return (
		<div className="home">
			<NavBar />
			<div className="divPlayMid">
				<PlayBig />
			</div>
		</div>
	);
};

export default Home;