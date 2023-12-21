import React from 'react';

interface AchievementProps {
	name: string;
	description: string;
}

const AchievementInfo:React.FC<AchievementProps> = ({name, description}) => {
	return (
		<div className="headerAchievementInfo">
			<div className="InfoBox">
				<p className='p1'>
					{name} : {description}
				</p>
			</div>
		</div>
	);
};

export default AchievementInfo;