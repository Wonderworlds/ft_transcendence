import React from 'react';
import '../styles/components/_logIn.scss';
import { useNavigate } from 'react-router-dom';



const LogIn = () => {
	
	const navigate = useNavigate();
	
	const navigateToLogIn = () => {
	  // 👇️ navigate to /LogIn
	  navigate('/LogIn');
	};
	
	return (
		<div>
			<button className='logInButton' onClick={navigateToLogIn}>
				<p className='logInText'>Log In</p>
			</button>
		</div>
	);
};

export default LogIn;