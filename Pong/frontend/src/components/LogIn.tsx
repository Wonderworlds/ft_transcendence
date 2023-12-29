import React, { useContext } from 'react';
import { Pages } from '../utils/types';
import { UserContext, getUser } from '../context/UserContext';

interface LogInProps {
	setpage: React.Dispatch<React.SetStateAction<any>>;
}

const LogIn: React.FC<LogInProps> = ({ setpage }) => {
	const [username, setusername] = React.useState('');
	const user = getUser();
	// const to42Auth = () => {
	// 	// 👇️ navigate to 42Auth
	// 	window.location.replace(
	// 		'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cfd734c4063d40cb2633f45c599ec496546613e86ccc386934324d52e798e452&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=code'
	// 	);
	// };

	const tmpAuth = () => {
		if (username === '') return;
		user.setPseudo(username);
		setpage(Pages.Home);
	};

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
