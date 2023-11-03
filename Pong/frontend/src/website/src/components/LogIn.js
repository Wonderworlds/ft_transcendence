import React from 'react';

const LogIn = () => {
	
	const to42Auth = () => {
	  // 👇️ navigate to 42Auth
	  window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-cfd734c4063d40cb2633f45c599ec496546613e86ccc386934324d52e798e452&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=code")
	};
	
	return (
		<div>
			<button className='logInButton' onClick={to42Auth}>
				<p className='logInText'>Log In</p>
			</button>
		</div>
	);
};

export default LogIn;
