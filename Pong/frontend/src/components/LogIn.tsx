import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAxios } from '../context/AxiosContext';
import { getUser } from '../context/UserContext';
import { Pages } from '../utils/types';

const LogIn: React.FC = () => {
	const [username, setUsername] = React.useState<string>('');
	const [password, setPassword] = React.useState<string>('');
	const [code, setCode] = React.useState<string>('');
	const [error, setError] = React.useState<string>('');
	const user = getUser();
	const axios = getAxios();
	const navigate = useNavigate();

	React.useEffect(() => {
		sessionStorage.clear();
		user.username = '';
		axios.setAuth({ token: '', username: '' });
	}, []);

	React.useEffect(() => {
		if (axios.ready) {
			axios.setReady(false);
			navigate(Pages.Home);
		}
	}, [axios.ready]);

	const twoFAElement = () => {
		return (
			<>
				<input
					type="text"
					name="Code"
					placeholder="Code"
					value={code}
					onChange={(event) => {
						setCode(event.target.value);
					}}
				/>
				<button
					className="logInButton"
					onClick={() => {
						Auth(2);
					}}
				>
					<p className="logInText">Log In</p>
				</button>
			</>
		);
	};

	const loginElement = () => {
		return (
			<>
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
			</>
		);
	};
	function signUp() {
		axios.client
			.post('auth/signup', { username: username, password: password })
			.then(() => {
				alert('User created');
				setUsername('');
				setPassword('');
			})
			.catch((err: any) => {
				setError(err.response?.data?.message);
			});
	}

	async function logIn() {
		axios.client
			.post('auth/login', { username: username, password: password })
			.then((res) => {
				console.log(res);
				user.setUsername(res.data.username);
				if (!res.data.twoFA) {
					axios.setAuth({ token: res.data.access_token, username: res.data.username });
					setUsername('');
					setPassword('');
				} else {
					alert('2FA enabled: Enter code received by email at ' + res.data.email);
				}
			})
			.catch((err: any) => {
				setError(err.response?.data?.message);
			});
	}

	async function twoFA() {
		return await axios.client
			.post('auth/twoFA', { username: username, password: password, code: code })
			.then((res) => {
				axios.setAuth({ token: res.data.access_token, username: res.data.username });
			})
			.catch((err: any) => {
				setError(err.response?.data?.message);
			});
	}

	async function Auth(id: number) {
		if (username === '' || password === '') return;
		if (id === 0) return await signUp();
		else if (id === 1) return await logIn();
		else if (code) return await twoFA();
	}

	return (
		<div>
			{error ? <p className="errorMsg">{error}</p> : <></>}
			{user.username ? twoFAElement() : loginElement()}
		</div>
	);
};

export default LogIn;
