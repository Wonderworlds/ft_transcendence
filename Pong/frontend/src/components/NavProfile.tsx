import React from 'react';

interface NavProfileProps {
	tab: string;
	setTab: React.Dispatch<React.SetStateAction<any>>;
	tabOptions: string[];
}

const navProfileElement = (
	tab: string,
	key: number,
	setTab: React.Dispatch<React.SetStateAction<string>>,
	tabOption: string
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
