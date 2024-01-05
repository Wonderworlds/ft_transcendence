import React from 'react'
import { getUser } from '../context/UserContext';



const PutPicture: React.FC = () => {
	const user = getUser();

	return (
		<div className="headerPutPicture">
			<div className="divTitlePicture">
				<p>picture</p>
			</div>
			<div className="divPicture">
				<input
					type="image"
					id="image"
					alt=""
					src={user.ppImg}
			/>
			</div>
			<div className="divLoadPicture">
				<input
					type="file"
					name="pp"
					accept="image/png, image/jpeg"/>
			</div>
		</div>
	);
};

export default PutPicture;