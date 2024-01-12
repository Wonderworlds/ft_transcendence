import React from 'react';
import ExtendCheckProfile from './ExtendCheckProfile.tsx'

interface UserChatInfoProps
{
	pseudo: string;
	text: string;
	type: number;
}

const ProfileInfo: React.FC<UserChatInfoProps> = ({pseudo, text, type}) => {
	if (type == 1)
		return (
			<div className="headerProfileInfo">
				<div className="NameChatBox">
					<ExtendCheckProfile pseudo={pseudo}/>
				</div>
				<div className="textChatBox">
					<p>:{text}</p>
				</div>
			</div>
		);
	else
		return (
			<div className="headerWhispProfileInfo">
				<div className="whispNameChatBox">
					<ExtendCheckProfile pseudo={pseudo}/>
				</div>
				<div className="whisperTextChatBox">
					<p>:{text}</p>
				</div>
			</div>
	);
};

export default ProfileInfo;