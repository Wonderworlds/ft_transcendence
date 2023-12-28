import React from 'react';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import { User } from '../utils/types.tsx';

interface HomeProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
	user: User;
}
const Home: React.FC<HomeProps> = ({ setpage, user }) => {
	return (
		<div className="home">
			<div className="divNav">
				<NavBar setpage={setpage} user={user} />
			</div>
			<div className="divPlayMid">
				<PlayBig setpage={setpage} user={user} />
			</div>
		</div>
	);
};

export default Home;
