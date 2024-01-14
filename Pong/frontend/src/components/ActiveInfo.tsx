import React from 'react';
import { getUser } from '../context/UserContext.tsx';
import Friends from '../pages/Friends.tsx';
import { TabOption } from '../utils/types.tsx';
import ProfilePlayer from './ProfilePlayer.tsx';

interface ActiveInfoProps {
	tab: TabOption;
}

const ActiveInfo: React.FC<ActiveInfoProps> = ({ tab }) => {
	const user = getUser();
	function whichTab(tab: TabOption) {
		switch (tab) {
			case TabOption.History:
				return (
					<div className="divProfilePlayerActiveInfo">
						<ProfilePlayer pseudo={user.pseudo} isClicked="" />
					</div>
				);
			case TabOption.Friend:
				return (
					<>
						<Friends />
					</>
				);
		}
	}

	return <div className="headerActiveInfo">{whichTab(tab)}</div>;
};

export default ActiveInfo;
