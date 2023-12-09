import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';

const Home: React.FC<homeProps> = ({props}) => {
	return (
		<div className="home">
			<div className="divNav">
				<NavBar profilePicture="PP" pseudo="Benjamin" />
			</div>
			<div className="divPlayMid">
				<PlayBig />
			</div>
		</div>
	);
};

export default Home;