import React from 'react';
import FortyTwo from '../components/FortyTwo.js';
import PongTitle from '../components/PongTitle.js';
import '../styles/pages/_logIn.scss';

const logIn = () => {
	return (
		<div className="logIn">
			<div className="divPongTitleCorner">
				<PongTitle />
			</div>
			<FortyTwo />
		</div>
	);
};

export default logIn;