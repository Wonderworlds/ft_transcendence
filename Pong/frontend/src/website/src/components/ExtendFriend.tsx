import React from 'react';
import InviteFriendButton from './InviteFriendButton';
import DeleteFriendButton from './DeleteFriendButton';

const ExtendFriend:React.FC = () => {
	return (
		<div className="headerExtendFriend">
			<div className="divInviteFriendButton">
				<InviteFriendButton/>
			</div>
			<div className="divDeleteFriendButton">
				<DeleteFriendButton/>
			</div>
		</div>
	);
};

export default ExtendFriend;