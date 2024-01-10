import React from 'react';
import { TabOption } from '../utils/types';

interface NavProfileProps {
	tab: TabOption;
	setTab: React.Dispatch<React.SetStateAction<any>>;
	tabOptions: TabOption[];
}

const navProfileElement = (
	tab: TabOption,
	key: number,
	setTab: React.Dispatch<React.SetStateAction<TabOption>>,
	tabOption: TabOption
) => {
	return (
		<div key={key} className="divButton">
			<button
				className={tab === tabOption ? 'ButtonNavProfileOn' : 'ButtonNavProfileOff'}
				onClick={() => {
					setTab(tabOption);
				}}
			>
				<p>{tabOption}</p>
			</button>
		</div>
	);
};

const NavProfile: React.FC<NavProfileProps> = ({ setTab, tab, tabOptions }) => {
	return (
		<>{tabOptions.map((tabOption, index) => navProfileElement(tab, index, setTab, tabOption))}</>
	);
};

export default NavProfile;
