import React from 'react';
import WhiteCase from './WhiteCase';
import CheckButton from './CheckButton';

const SquareChangeName = () => {
	return (
		<div>
			<div className="ChangeName">
				<p>Change name</p>
			</div>
			<div className="PutName">
				<WhiteCase />
			</div>
			<div className="ChangeNameButton">
				<CheckButton />
			</div>
		</div>
	);
};

export default SquareChangeName;