import React, { useState } from 'react';
import { getUser } from '../context/UserContext';
import axios from 'axios';

const PutPicture: React.FC = () => {
	const user = getUser();
	const [file, setFile] = useState<any>();

	function handleSubmit(event: any) {
		event.preventDefault();
		const formData = new FormData();
		formData.append('file', file);
		formData.append('fileName', file.name);
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};
		axios.post('https://localhost:3000/images', formData, config).then((response) => {
			console.log(response.data);
		});
	}
	return (
		<div className="headerPutPicture">
			<div className="divTitlePicture">
				<p>picture</p>
			</div>
			<div className="divPicture">
				<input type="image" id="image" alt="" src={user.ppImg} />
			</div>
			<div className="divLoadPicture">
				<form onSubmit={handleSubmit} encType="multipart/form-data" action="/upload">
					<input
						type="file"
						name="pp"
						accept="image/png, image/jpeg"
						onChange={(event: any) => {
							setFile(event.target.files[0]);
						}}
					/>
					<button type="submit">Upload</button>
				</form>
			</div>
		</div>
	);
};

export default PutPicture;
