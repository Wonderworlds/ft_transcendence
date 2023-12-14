import React from 'react'

const PutFile: React.FC = () => {
	return (
		<div className="divPutFile">
			<input type="file" id="pp" name="pp" accept="image/png, image/jpeg"/>
		</div>
	);
};

export default PutFile;