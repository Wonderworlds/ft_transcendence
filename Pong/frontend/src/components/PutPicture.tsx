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
		const formData = new FormData();
		formData.append('image', file);
		client
			.post('/me/uploadAvatar', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res: any) => {
				console.log(res);
				user.setPPSrc(res.data.src);
			})
			.catch((err) => {
				console.log(err);
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
				<p>picture</p>
			</div>
			<div className="divPicture">
				<input type="image" id="image" alt="" src={user.ppImg} />
			</div>
			<div className="divLoadPicture">
				<form onSubmit={handleSubmit}>
					<input type="file" onChange={handleChange} />
					<button type="submit">Upload</button>
				</form>
			</div>
		</div>
	);
};

export default PutPicture;
