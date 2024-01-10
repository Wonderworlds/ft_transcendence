import React from 'react';

interface UserChatInfoProps
{
	text: string;
}

const SystemInfo: React.FC<UserChatInfoProps> = ({text}) => {
	return (
		<div className="headerSystemInfo">
					<div className="divSystemName">
						<p>system</p>
					</div>
					<div className="divSystemTransi">
						<p>:</p>
					</div>
					<div className="divSystemMsg">
						<p> {text}</p>
					</div>
				</div>
	);
};

export default SystemInfo;