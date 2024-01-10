import React from 'react';
import { Status } from '../utils/types';

export interface FriendsInfoProps {
	pP: string;
	pseudo: string;
	status: Status;
	isClicked: string;
	setIsClicked: React.Dispatch<React.SetStateAction<string>>;
}

const FriendsInfo: React.FC<FriendsInfoProps> = ({
	pP,
	pseudo,
	status,
	setIsClicked,
	isClicked,
}) => {
	return (
		<div
			onClick={() => {
				setIsClicked(pseudo);
			}}
			className={isClicked === pseudo ? 'divFriendInfoClicked' : 'divFriendInfoNotClicked'}
		>
			<div className="divFriendInfo">
				<img src={pP} />
				<p>{pseudo}</p>
				<div className={status}>
					{status === Status.Online ? <span className="blink"></span> : null}
				</div>
			</div>
		</div>
	);
};

export default FriendsInfo;
