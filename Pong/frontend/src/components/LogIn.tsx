import React from 'react';
import { PrincipalWebsocketContext } from '../context/WebsocketContext';
import { User } from '../utils/types';
import { useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';

const LogIn: React.FC = () => {
	const [username, setusername] = React.useState('');

	const navigate = useNavigate();
	React.useEffect(() => {
		// socket.on('onLogin', (user: User) => {
		// 	if (user.pseudo === '') return console.log('username not valid');
		// 	navigate('/Home');
		// });
		// return () => {
		// 	socket.off('onLogin');
		// };
	}, []);

	// const to42Auth = () => {
	// 	// 👇️ navigate to 42Auth
	// 	window.location.replace(
	// 		'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cfd734c4063d40cb2633f45c599ec496546613e86ccc386934324d52e798e452&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=code'
	// 	);
	// };

	function tmpAuth() {
		const socket = io(`${import.meta.env.VITE_BURL}?${username}`);
		console.log(socket);
		// socket.emit('login', username);
	}

	const handleChange = (event: any) => {
		setusername(event.target.value);
	};

	return (
		<div>
			<input
				type="text"
				name="Username"
				placeholder="Username"
				value={username}
				onChange={handleChange}
			/>
			<button className="logInButton" onClick={tmpAuth}>
				<p className="logInText">Log In</p>
			</button>
		</div>
	);
};

export default LogIn;
