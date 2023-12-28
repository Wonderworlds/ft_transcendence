import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ButtonAccept: React.FC = () => {
	return (
		<div className='divdisconnectButton'>
			<button className='disconnectButton'>
				<Link to="/"><p className='disconnectText'>disconnect</p></Link>
			</button>	
		</div>
	);
};

export default ButtonAccept;