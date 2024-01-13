import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../context/UserContext.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import { Pages } from '../utils/types.tsx';
import FriendsDemands from './FriendsDemands.tsx';
import Play from './Play.tsx';
import PongTitle from './PongTitle.tsx';

type InviteMatch = {
	lobby: string;
	pseudo: string;
};

const NavBar: React.FC = () => {
	const user = getUser();
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const navigate = useNavigate();
	const location = useLocation();
	const [invites, setInvites] = React.useState<InviteMatch[]>([]);

	React.useEffect(() => {
		if (!socket) return;
		socket.on('friendGame', (response: { message: string; lobby: string; sender: string }) => {
			console.log(response.message);
			setInvites((inv) => {
				const newInv = [...inv];
				const index = newInv.findIndex((i) => i.pseudo === response.sender);
				if (index !== -1) newInv.splice(index, 1);
				newInv.push({ lobby: response.lobby, pseudo: response.sender });
				if (newInv.length > 3) newInv.shift();
				return newInv;
			});
			setTimeout(() => {
				setInvites((inv) => {
					const newInv = [...inv];
					const toDel = newInv.find((i) => i.lobby === response.lobby);
					if (!toDel) return newInv;
					newInv.splice(newInv.indexOf(toDel), 1);
					return newInv;
				});
			}, 1000 * 16);
		});

		return () => {
			socket.off('friendGame');
		};
	}, [socket]);

	const playElement = () => {
		return location.pathname.toLowerCase() == '/home' ? (
			<div></div>
		) : (
			<Link to={Pages.WaitingMatch}>
				<div className="navPlay">
					<Play />
				</div>
			</Link>
		);
	};

	const handleClick = (accept: boolean, pseudo: string, lobby: string) => {
		socket.emit('responseFriendGame', { lobby: lobby, accept: accept });
		if (accept) {
			navigate(Pages.Pong);
			socketContext.setLobby(lobby);
		} else
			setInvites((inv) => {
				const newInv = [...inv];
				const toDel = newInv.find((i) => i.lobby === lobby);
				if (!toDel) return newInv;
				newInv.splice(newInv.indexOf(toDel), 1);
				return newInv;
			});
	};
	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div
					className="navPongTitle"
					onClick={() => {
						navigate(Pages.Home);
					}}
				>
					<PongTitle />
				</div>
				{invites ? null : playElement()}
				<div className="navInviteMatch">
					{invites.map((invite, index) => {
						return (
							<FriendsDemands
								key={index}
								pseudo={invite.pseudo}
								handleClick={handleClick}
								lobby={invite.lobby}
							/>
						);
					})}
				</div>
				<div className="navRight">
					<div
						className="navProfilePicture"
						onClick={() => {
							navigate(Pages.Stats);
						}}
					>
						<img src={user.ppImg} />
					</div>
					<div
						className="navPseudo"
						onClick={() => {
							navigate(Pages.Settings);
						}}
					>
						<p>{user.pseudo}</p>
					</div>
					<div
						className="gg-log-off"
						onClick={() => {
							navigate(Pages.Root);
							window.location.reload();
						}}
					></div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
