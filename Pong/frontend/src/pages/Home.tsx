import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';

interface HomeProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}
const Home: React.FC<HomeProps> = ({ setpage }) => {
	console.log('Home');

	return (
		<div className="home">
			<div className="divNav">
				<NavBar setpage={setpage} />
			</div>
			<div className="divPlayMid">
				<PlayBig setpage={setpage} />
			</div>
		</div>
	);
};

export default Home;
