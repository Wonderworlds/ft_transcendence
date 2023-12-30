import PongTitle from './PongTitle.tsx';
import Play from './Play.tsx';
import Chat from './Chat.tsx';
import { Pages } from '../utils/types.tsx';
import React from 'react';
import { getUser } from '../context/UserContext.tsx';

const NavBar: React.FC = () => {
	const user = getUser();

	const playElement = () => {
		return user.page == Pages.Home ? (
			<div></div>
		) : (
			<div
				className="navPlay"
				onClick={() => {
					user.setPage(Pages.WaitingMatch);
				}}
			>
				<Play />
			</div>
		);
	};

	return (
		<header className="headerNavBar">
			<nav className="navBar">
				<div
					className="navPongTitle"
					onClick={() => {
						user.setPage(Pages.Home);
					}}
				>
					<PongTitle />
				</div>
				{playElement()}
				<div className="navRight">
					<div
						className="navProfilePicture"
						onClick={() => {
							user.setPage(Pages.Parameter);
						}}
					>
						<img src={user.ppImg} />
					</div>
					<div
						className="navPseudo"
						onClick={() => {
							user.setPage(Pages.Profile);
						}}
					>
						<p>{user.pseudo}</p>
					</div>
					<div
						className="navChat"
						onClick={() => {
							user.setPage(Pages.Chat);
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
