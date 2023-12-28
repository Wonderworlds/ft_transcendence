import React, { useState } from 'react';

interface DropdownMenuProps {
	dropdownButtonName: string;
	dropdownActions: {
		name: string;
		onClick: () => void;
	}[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
	dropdownButtonName,
	dropdownActions,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="headerDropdownMenu">
			<button
				className="dropdownMenu"
				onClick={() => setIsOpen((prevState) => !prevState)}
			>
				<p className="pButtonName">{dropdownButtonName}</p>
			</button>
			{isOpen && (
				<div className="dropdownContent">
					<ul>
						{dropdownActions.map((dropdownAction) => (
							<li key={dropdownAction.name}>
								<button onClick={dropdownAction.onClick}>
									{dropdownAction.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
