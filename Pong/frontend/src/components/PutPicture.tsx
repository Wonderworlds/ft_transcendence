import React, { useState } from 'react';
import { getAxios } from '../context/AxiosContext';
import { getUser } from '../context/UserContext';

const PutPicture: React.FC = () => {
	const user = getUser();
	const client = getAxios().client;
	const [file, setFile] = useState<File | null>(null);

	function handleSubmit(event: any) {
		event.preventDefault();
		if (!file) return;
		if (file.size > 1000000) {
			alert('Error: File is too big');
			return;
		}
		const formData = new FormData();
		formData.append('image', file);
		client
			.post('/me/uploadAvatar', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res: any) => {
				user.setPPSrc(res.data.src);
				setFile(null);
			})
			.catch((err) => {
				alert('Error: ' + err.response.data?.message);
			});
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0]);
		}
	};

	return (
		<div className="headerPutPicture">
			<div className="divTitlePicture">
				<p>Profile Picture</p>
			</div>
			<div className="divPicture">
				<img alt="" src={user.ppImg} />
			</div>
			<div className="divLoadPicture">
				<form onSubmit={handleSubmit} className="file">
					<label id="submitButton">
						<input
							type="file"
							onChange={handleChange}
							accept="image/*, .jpg, .jpeg, .png, .gif"
							name={file?.name}
							className="inputFile"
						/>
						{file ? file.name : 'Choose a file'}
					</label>
					<button id="submitButton" type="submit">
						Upload
					</button>
				</form>
			</div>
		</div>
	);
};

export default PutPicture;
