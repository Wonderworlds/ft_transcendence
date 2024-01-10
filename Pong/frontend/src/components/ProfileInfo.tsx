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
	else
		return (
			<div className="headerWhispProfileInfo">
				<div className="whispProfileInfoBox">
					<div className="whispDivName">
							<ExtendCheckProfile pseudo={pseudo}/>
					</div>
					<div className="whispDivTransi">
						<p>:</p>
					</div>
					<div className="whispDivMsg">
						<p> {text}</p>
					</div>
				</div>
			</div>
	);
};

export default ProfileInfo;