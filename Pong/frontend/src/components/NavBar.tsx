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

	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div className="navPongTitle">
					<div
						onClick={() => {
							setpage(Pages.Home);
						}}
					>
						<PongTitle />
					</div>
				</div>
				<div className="navPlay">
					<div
						onClick={() => {
							setpage(Pages.WaitingMatch);
						}}
					>
						<Play />
					</div>
				</div>
				<div className="navRight">
					<div className="navProfilePicture">
						<div
							onClick={() => {
								setpage(Pages.Parameter);
							}}
						>
							<img src={user.ppImg} />
						</div>
					</div>
					<div className="navPseudo">
						<div
							onClick={() => {
								setpage(Pages.Profile);
							}}
						>
							<p>{user.pseudo}</p>
						</div>
					</div>
					<div className="navChat">
						<div
							onClick={() => {
								setpage(Pages.Chat);
							}}
						>
							<Chat />
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default NavBar;
