import PongTitle from './PongTitle.tsx';
import Play from './Play.tsx';
import Chat from './Chat.tsx';
import { Pages } from '../utils/types.tsx';
import React from 'react';
import { getUser } from '../context/UserContext.tsx';

interface NavBarProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const NavBar: React.FC<NavBarProps> = ({ setpage }) => {
	const user = getUser();
	console.log(user);
	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div
					className="navPongTitle"
					onClick={() => {
						setpage(Pages.Home);
					}}
				>
					<PongTitle />
				</div>
				<div
					className="navPlay"
					onClick={() => {
						setpage(Pages.WaitingMatch);
					}}
				>
					<Play />
				</div>
				<div className="navRight">
					<div
						className="navProfilePicture"
						onClick={() => {
							setpage(Pages.Parameter);
						}}
					>
						<img src={user.ppImg} />
					</div>
					<div
						className="navPseudo"
						onClick={() => {
							setpage(Pages.Profile);
						}}
					>
						<p>{user.pseudo}</p>
					</div>
					<div
						className="navChat"
						onClick={() => {
							setpage(Pages.Chat);
						}}
					>
						<Chat />
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
