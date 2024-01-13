import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHome from '../components/ChatHome.tsx';
import NavBar from '../components/NavBar.tsx';
import PlayBig from '../components/PlayBig.tsx';
import ProfilePlayer from '../components/ProfilePlayer.tsx';
import { getAxios } from '../context/AxiosContext.tsx';
import { getUser } from '../context/UserContext.tsx';
import { getSocket } from '../context/WebsocketContext.tsx';
import { Pages } from '../utils/types.tsx';

const Home: React.FC = () => {
	const user = getUser();
	const socketContext = getSocket();
	const socket = socketContext.socket;
	const axios = getAxios();
	const navigate = useNavigate();
	const [pseudo, setPseudo] = React.useState<string>(user.pseudo);
	const [isClicked, setIsClicked] = React.useState<string>('');
	const [invitation, setInvitation] = React.useState<{ lobby: string; sender: string }>(
		{} as { lobby: string; sender: string }
	);
	const [friendDemand, setFriendDemand] = React.useState<{ sender: string }>(
		{} as { sender: string }
	);

	React.useEffect(() => {
		setIsClicked(pseudo);
	}, [pseudo]);

	const invitationElement = (invitation: string, handleClick: (accept: boolean) => void) => {
		return (
			<div className="divHomeButtonsRight">
				<h3>{invitation}</h3>
				<div className="divButtons">
					<button className="buttonHomeAccept" onClick={() => handleClick(true)}>
						accept
					</button>
					<button className="buttonHomeDecline" onClick={() => handleClick(false)}>
						Decline
					</button>
				</div>
			</div>
		);
	};

	function handleclickInvitation(accept: boolean) {
		socket.emit('responseFriendGame', { lobby: invitation.lobby, accept: accept });
		if (accept) {
			socketContext.setLobby(invitation.lobby);
			navigate(Pages.Pong);
		} else setInvitation({} as { lobby: string; sender: string });
	}

	async function handleclickFriendDemand(accept: boolean) {
		await axios.client
			.post(`me/friends/${pseudo}/` + accept ? 'accept' : 'decline')
			.catch((err: any) => {
				alert(err.response?.data?.message);
			});
		setFriendDemand({} as { sender: string });
	}

	return (
		<div className="home">
			<div className="divNav">
				<NavBar />
			</div>
			<div className="divHome">
				<div className="divPlayMid">
					<div className="divScreenHome">
						{isClicked ? <ProfilePlayer isClicked="" pseudo={pseudo} /> : null}
					</div>
					<div className="divHomeButtons">
						<div className="divPlayBigHome">
							<PlayBig />
						</div>
						{invitation?.sender
							? invitationElement(
									'Invitation for game from ' + invitation.sender,
									handleclickInvitation
							  )
							: null}
						{friendDemand?.sender
							? invitationElement(
									'friendDemand from ' + friendDemand.sender,
									handleclickFriendDemand
							  )
							: null}
					</div>
				</div>
				<div className="divChatHome">
					<ChatHome
						setPseudo={setPseudo}
						setInvitation={setInvitation}
						setFriendDemand={setFriendDemand}
					/>
				</div>
			</div>
		</div>
	);
};

export default Home;
