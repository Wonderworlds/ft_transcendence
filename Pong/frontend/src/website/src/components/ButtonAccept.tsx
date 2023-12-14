import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ButtonAccept: React.FC = () => {
	return (
		<div className='divAcceptButton'>
			<button className='acceptButton'>
				<Link to="/Home"><p className='acceptText'>accept change</p></Link>
			</button>	
		</div>
	);
};

export default ButtonAccept;