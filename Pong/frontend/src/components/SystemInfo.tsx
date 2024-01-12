import React from 'react';

interface UserChatInfoProps
{
	text: string;
}

const SystemInfo: React.FC<UserChatInfoProps> = ({text}) => {
	return (
		<div className="headerSystemInfo">
			<div className="divMSgSystemInfo">
				<p>system: {text}</p>
			</div>
		</div>
	);
};

export default SystemInfo;