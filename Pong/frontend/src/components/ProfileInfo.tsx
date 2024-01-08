import React from 'react';
import ExtendCheckProfile from './ExtendCheckProfile.tsx'

interface UserChatInfoProps
{
	pseudo: string;
	text: string;
}

const ProfileInfo: React.FC<UserChatInfoProps> = ({pseudo, text}) => {
	
	return (
		<div className="headerProfileInfo">
			<div className="profileInfoBox">
				<div className="divName">
					<ExtendCheckProfile pseudo={pseudo}/>
				</div>
				<div className="divTransi">
					<p>:</p>
				</div>
				<div className="divMsg">
					<p> {text}</p>
				</div>
			</div>
		</div>
	);
};

export default ProfileInfo;