import React from 'react';
import FriendsDemands from '../components/FriendsDemands.tsx';
import FriendsInfo, { FriendsInfoProps } from '../components/FriendsInfo.tsx';
import ProfilePlayer from '../components/ProfilePlayer.tsx';
import { getAxios } from '../context/AxiosContext.tsx';
import { User } from '../utils/types.tsx';

const Friends: React.FC = () => {
	const axios = getAxios();
	const [friendsDemands, setFriendsDemands] = React.useState<Array<User>>([]);
	const [friendsList, setFriendsList] = React.useState<Array<User>>([]);
	const [friendPseudo, setFriendPseudo] = React.useState<string>('');
	const [isClicked, setIsClicked] = React.useState<string>('');
	const [isFriendsDemands, setIsFriendsDemands] = React.useState<boolean>(true);

	React.useEffect(() => {
		if (!axios.auth.token) return;
		getFriendsList();
		getFriendsDemands();
	}, [axios.ready]);

	async function responseFriendsDemands(option: string, pseudo: string) {
		await axios.client.post(`me/friends/${pseudo}/${option}`).catch((err: any) => {
			alert(err.response?.data?.message);
			return false;
		});
		return true;
	}

	async function getFriendsDemands() {
		await axios.client
			.get('me/friends/demands')
			.then((res: any) => {
				console.log(res.data);
				setFriendsDemands(res.data);
			})
			.catch((err: any) => {
				alert(err.response?.data?.message);
				return false;
			});
		return true;
	}

	async function sendFriendDemand() {
		await axios.client
			.post(`me/friends/${friendPseudo}`)
			.then(() => {
				getFriendsList();
			})
			.catch((err: any) => {
				alert(err.response?.data?.message);
				return false;
			});
		return true;
	}

	async function getFriendsList() {
		await axios.client
			.get('me/friends')
			.then((res: any) => {
				console.log(res.data);
				setFriendsList(res.data);
			})
			.catch((err: any) => {
				alert(err.response?.data?.message);
				return false;
			});
		return true;
	}

	async function handleClick(option: string, pseudo: string) {
		if (!(await responseFriendsDemands(option, pseudo))) return;
		await getFriendsList();
		await getFriendsDemands();
	}

	const friendsElement: any = friendsList.map((item, index) => {
		const props: FriendsInfoProps = {
			pP: item.ppImg,
			pseudo: item.pseudo,
			status: item.status,
			isClicked: isClicked,
			setIsClicked: setIsClicked,
		};
		return <FriendsInfo key={index} {...props} />;
	});

	const friendsDemandsElement: any = friendsDemands.map((item, index) => {
		return (
			<FriendsDemands
				key={index}
				pseudo={item.pseudo}
				ppImg={item.ppImg}
				handleClick={handleClick}
			/>
		);
	});

	const inviteGame = (pseudo: string) => {
		console.log('invite game');
	};
	const deleteFriend = (pseudo: string) => {
		console.log('delete friend');
	};
	return (
		<div className="headerFriends">
			<div className="divFriendsLeft">
				<p>Friends List</p>
				<div className="divFriendElement">{friendsElement}</div>
				<div className="divAddFriend">
					<input
						type="text"
						placeholder="Add Friend"
						value={friendPseudo}
						onChange={(event) => {
							setFriendPseudo(event.target.value);
						}}
					/>
					<div onClick={sendFriendDemand}>Add</div>
				</div>
			</div>
			<div className="divFriendsMiddle">
				{isClicked ? (
					<ProfilePlayer pseudo={isClicked} inviteGame={inviteGame} deleteFriend={deleteFriend} />
				) : null}
			</div>
			{isFriendsDemands ? (
				<div className="divFriendsRight">
					<p>Friends demands</p>
					<div className="divFriendElement">{friendsDemandsElement}</div>
				</div>
			) : null}
		</div>
	);
};

export default Friends;
