import React from 'react'
import ParametersTitle from '../components/ParametersTitle';
import NavBar from '../components/NavBar';
import SquareChangeName from '../components/SquareChangeName';
import DoubleAuthentification from '../components/DoubleAuthentification';

const Parameters = () => {
	return (
		<div className="parameters">
			<NavBar />
			<div className="divParametersTitleMid">
				<ParametersTitle />
			</div>
			<div className="divChangeName">
				<SquareChangeName />
				<p className="titlePicture">Picture</p>
			</div>
			<div className="divDoubleAuthentification">
				<DoubleAuthentification />
				<p>double authentification</p>
			</div>
			<div className="divChangePicture">
				<p></p>
			</div>
		</div>
	);
};

export default Parameters;