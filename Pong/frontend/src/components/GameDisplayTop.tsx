import React from 'react';

const GameDisplayTop: React.FC = () => {
	return (
		<div className="headerGameDisplayTop">
			<div className="divNameFirstPLayer">
				<div className="divPictureFirstPLayer">
					<input type="image" id="image" alt="" src="../../pp_default.png" className="pp1"/>
				</div>
				<div className="divPutNameFirstPlayer">
					<h1>First</h1>
				</div>
			</div>
			<div className="divPutVersus">
				<h1>VS</h1>
			</div>
			<div className="divNameSecondPLayer">
				<div className="divPutNameSecondPlayer">
					<h1>Second</h1>
				</div>
				<div className="divPictureSecondPLayer">
					<input type="image" id="image" alt="" src="../../pp_default.png" className="pp2"/>
				</div>
			</div>
		</div>
	);
};

export default GameDisplayTop;