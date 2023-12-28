import { Link, useLocation } from 'react-router-dom';
import PongTitle from './PongTitle.tsx';
import Play from './Play.tsx';
import Chat from './Chat.tsx';
import { PrincipalWebsocketContext } from '../context/WebsocketContext';
import { User } from '../utils/types.tsx';
import React from 'react';

const NavBar: React.FC = () => {
	const socket = React.useContext(PrincipalWebsocketContext);
	const [pp, setpp] = React.useState('42_Logo.svg');
	const [pseudo, setpseudo] = React.useState('pseudo');

	React.useEffect(() => {
		socket.on('onGetUser', (user: User) => {
			setpp(user.ppImg);
			setpseudo(user.pseudo);
		});
		socket.emit('getUser');
		return () => {
			socket.off('onGetUser');
		};
	}, []);

	const location = useLocation();

	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div className="navPongTitle">
					<Link to="/Home">
						<PongTitle />
					</Link>
				</div>
				{location.pathname !== '/Home' && (
					<div className="navPlay">
						<Link to="/WaitingMatch">
							<Play />
						</Link>
					</div>
				)}
				<div className="navRight">
					<div className="navProfilePicture">
						<Link to="/Parameters">
							<img src={pp} />
						</Link>
					</div>
					<div className="navPseudo">
						<Link to="/Profile">
							<p>{pseudo}</p>
						</Link>
					</div>
					<div className="navChat">
						<Link to="/Chat">
							<Chat />
						</Link>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
