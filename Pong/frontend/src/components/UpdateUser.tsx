import { AxiosResponse } from 'axios';
import React from 'react';
import { getAxios } from '../context/AxiosContext.tsx';
import { getUser } from '../context/UserContext.tsx';

interface ChangeNameProps {}

const UpdateUser: React.FC<ChangeNameProps> = () => {
	const user = getUser();
	const client = getAxios().client;
	const [pseudo, setPseudo] = React.useState<string>(user.pseudo);
	const [email, setEmail] = React.useState<string>(user.email);
	const [cb, setCB] = React.useState<boolean>(user.doubleAuth);

	const handleSubmit = () => {
		const pseudoLC = pseudo.toLowerCase();
		if (pseudoLC === '' || pseudoLC === user.pseudo) return alert('Invalid pseudo');
		client
			.put('/me/pseudo', { pseudo: pseudoLC })
			.then((res: AxiosResponse) => {
				if (res.data?.success) user.setPseudo(pseudoLC);
				alert('pseudo changed to ' + pseudoLC);
			})
			.catch((err) => {
				alert('Error: ' + err.response.data?.message);
			});
	};

	React.useEffect(() => {
		if (cb !== user.doubleAuth) {
			client
				.put('/me/twoFA', { twoFA: cb })
				.then((res: AxiosResponse) => {
					if (res.data?.success) user.setDoubleAuth(cb);
				})
				.catch((err) => {
					alert('Error: ' + err.response.data?.message);
				});
		}
	}, [cb]);

	const handleSubmit2FA = () => {
		const emailLC = email.toLowerCase();
		client
			.put('/me/email', { email: emailLC })
			.then((res: AxiosResponse) => {
				if (res.data?.success) user.setEmail(emailLC);
				alert('email changed to ' + emailLC);
			})
			.catch((err) => {
				alert('Error: ' + err.response.data?.message);
			});
	};

	return (
		<div className="divChangeName">
			<p>Change Pseudo</p>
			<div className="divWhiteSpaceChangeName">
				<input
					type="text"
					name="pseudo"
					placeholder="pseudo"
					value={pseudo}
					onChange={(event) => setPseudo(event.target.value)}
				/>
				<button id="submitButton" onClick={handleSubmit}>
					Submit
				</button>
			</div>
			<div className="divDoubleAuthentification">
				{cb ? <p>2FA Email &#x2705;</p> : <p>2FA Email &#x274C;</p>}
				<button
					id="submitButton"
					name="2FA"
					onClick={() => {
						if (user.email === '') {
							alert('You need to set an email first');
							return;
						}
						setCB((prev) => !prev);
					}}
				>
					{cb ? 'Enabled' : 'Disabled'}
				</button>
			</div>
			<p>Change Email</p>
			<div className="divEmail">
				<input
					type="text"
					name="email"
					placeholder="email@mail.com"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
				/>
				<button id="submitButton" onClick={handleSubmit2FA}>
					Submit
				</button>
			</div>
		</div>
	);
};

export default UpdateUser;
