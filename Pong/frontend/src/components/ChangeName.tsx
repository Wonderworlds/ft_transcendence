import { AxiosResponse } from 'axios';
import React from 'react';
import { getAxios } from '../context/AxiosContext.tsx';
import { getUser } from '../context/UserContext.tsx';

interface ChangeNameProps {}

const ChangeName: React.FC<ChangeNameProps> = () => {
	const user = getUser();
	const client = getAxios().client;
	const [pseudo, setPseudo] = React.useState<string>(user.pseudo);
	const [email, setEmail] = React.useState<string>(user.email);
	const [cb, setCB] = React.useState<boolean>(user.doubleAuth);

	const handleSubmit = () => {
		client
			.put('/me/pseudo', { pseudo: pseudo })
			.then((res: AxiosResponse) => {
				console.log(res.data);
				if (res.data?.success) user.setPseudo(pseudo);
			})
			.catch((err) => {
				alert('Error: ' + err.response.data?.message);
			});
	};

	React.useEffect(() => {
		return () => {
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
		};
	}, [cb]);

	const handleSubmit2FA = () => {
		client
			.put('/me/email', { email: email })
			.then((res: AxiosResponse) => {
				if (res.data?.success) user.setEmail(email);
			})
			.catch((err) => {
				alert('Error: ' + err.response.data?.message);
			});
	};

	return (
		<div className="divChangeName">
			<div className="divTitleChangeName">
				<p>change name</p>
			</div>
			<div className="divWhiteSpaceChangeName">
				<input
					type="text"
					name="pseudo"
					placeholder="pseudo"
					value={pseudo}
					onChange={(event) => setPseudo(event.target.value)}
				/>
				<button onClick={handleSubmit}>Submit</button>
			</div>
			<div className="divDoubleAuthentification">
				<div className="divTitle2FA">
					<p>DoubleAuthentification</p>
				</div>
				<div className="divCheckBox2FA">
					<input
						type="checkbox"
						name="2FA"
						onChange={(event) => {
							setCB(event.target.checked);
						}}
						checked={cb}
					/>
					{cb ? (
						<div>
							<input
								type="text"
								name="email"
								placeholder="email@mail.com"
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
							<button onClick={handleSubmit2FA}>Submit</button>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default ChangeName;
