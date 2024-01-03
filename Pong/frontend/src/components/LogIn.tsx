import React from 'react';
import { getUser } from '../context/UserContext';
import { getAxios } from '../context/AxiosContext';

const LogIn: React.FC = () => {
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const user = getUser();
	const axios = getAxios().client;

	React.useEffect(() => {
		axios.get('auth').then((res) => console.log(res));
	}, []);

	async function Auth() {
		if (username === '' || password === '') return;
		const userDto = { ...user.userAsDto(), username: username };
		user.createUser(userDto);
	}

	return (
		<div>
			<input
				type="text"
				name="Username"
				placeholder="Username"
				value={username}
				onChange={(event) => {
					setUsername(event.target.value);
				}}
			/>
			<input
				type="text"
				name="password"
				placeholder="Password"
				value={password}
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<button className="logInButton" onClick={Auth}>
				<p className="logInText">Log In</p>
			</button>
		</div>
	);
};

export default LogIn;
