import React from 'react';

const Cancel: React.FC<{ handleClick: () => void }> = ({ handleClick }) => {
	return (
		<div>
			<button onClick={handleClick} className="cancelButton">
				<p className="cancelText">Cancel</p>
			</button>
		</div>
	);
};

export default Cancel;
