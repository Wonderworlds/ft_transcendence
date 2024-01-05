import React from 'react';
import DoubleAuthentification from '../components/DoubleAuthentification.tsx';
import { getUser } from '../context/UserContext.tsx';

interface ChangeNameProps {}

const ChangeName: React.FC<ChangeNameProps> = () => {
	const user = getUser();
	const [username, setusername] = React.useState('');

	async function changeProfile() {
		if (username === '') return;
		user.setPseudo(username);
		user.setDoubleAuth(true);
		user.setppImg('pp_1.png');
	}

	const handleChange = (event: any) => {
		setusername(event.target.value);
	}
	return (
		<div className="divChangeName">
			<div className="divTitleChangeName">
				<p>change name</p>
			</div>
			<div className="divWhiteSpaceChangeName">
				<input
					type="text"
					name="Username"
					placeholder="Username"
					value={username}
					onChange={handleChange}
				/>
			</div>
			<div className="divDoubleAuthentification">
				<div className="divTitle2FA">
					<p>DoubleAuthentification</p>
				</div>
				<div className="divCheckBox2FA">
					<input
						type="checkbox"
						name="2FA"
						value="on"
						onChange={handleChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChangeName;
