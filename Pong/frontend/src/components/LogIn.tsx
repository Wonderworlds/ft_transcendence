import React from 'react';
import { getUser } from '../context/UserContext';
import { getAxios } from '../context/AxiosContext';
import { AxiosError } from 'axios';

const LogIn: React.FC = () => {
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [error, setError] = React.useState<string>('');
	const user = getUser();
	const axios = getAxios().client;

	React.useEffect(() => {
		axios.get('auth').then((res) => {});
	}, []);

	React.useEffect(() => {
		if (error === 'User not found') {
			signUp();
		}
	}, [error]);

	async function signUp() {
		return await axios
			.post('auth/signup', { username: username, password: password })
			.then(() => {
				setError('User created');
			})
			.catch((err: any) => {
				setError(err.response?.data?.message);
			});
	}

	async function logIn() {
		axios
			.post('auth/login', { username: username, password: password })
			.then((res) => {
				setError(res.data.username);
			})
			.catch((err: any) => {
				setError(err.response?.data?.message);
			});
	}

	async function Auth(id: number) {
		if (username === '' || password === '') return;
		if (id) return await logIn();
		else return await signUp();
	}

	return (
		<div>
			{error ? <p className="errorMsg">{error}</p> : <></>}
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
				type="password"
				name="password"
				placeholder="Password"
				value={password}
				onChange={(event) => {
					setPassword(event.target.value);
				}}
			/>
			<button
				className="logInButton"
				onClick={() => {
					Auth(1);
				}}
			>
				<p className="logInText">Log In</p>
			</button>
			<button
				className="SignInButton"
				onClick={() => {
					Auth(0);
				}}
			>
				<p className="logInText">Sign In</p>
			</button>
		</div>
	);
};

export default LogIn;
