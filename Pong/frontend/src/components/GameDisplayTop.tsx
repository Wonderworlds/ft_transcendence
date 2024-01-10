import React from 'react';

const GameDisplayTop: React.FC = () => {
	return (
		<div className="headerGameDisplayTop">
			<div className="divNameFirstPLayer">
				<img src="../../pp_1.png" />
				<h1>First</h1>
			</div>
			<div className="divPutVersus">
				<h1>VS</h1>
			</div>
			<div className="divNameSecondPLayer">
				<h1>Second</h1>
				<img src="../../pp_1.png" />
			</div>
		</div>
	);
};

export default GameDisplayTop;
