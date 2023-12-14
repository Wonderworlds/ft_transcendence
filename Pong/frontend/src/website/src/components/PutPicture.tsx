import React from 'react'
import TitlePicture from '../components/TitlePicture.tsx';
import ParameterPicture from '../components/ParameterPicture.tsx';
import PutFile from '../components/PutFile.tsx';


const PutPicture: React.FC = () => {
	return (
		<div className="divPutPicture">
			<div className="elem1">
				<TitlePicture/>
			</div>
			<div className="elem2">
				<ParameterPicture/>
			</div>
			<div className="elem3">
				<PutFile/>
			</div>
		</div>
	);
};

export default PutPicture;