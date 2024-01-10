import React, { useState } from 'react';

interface DropleftMenuProps {
	dropleftButtonName: string;
	dropleftActions: {
		name: string;
		onClick: () => void;
	}[];
}

const DropleftMenu: React.FC<DropleftMenuProps> = ({
	dropleftButtonName,
	dropleftActions,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="headerDropleftMenu">
			<button
				className="dropleftMenu"
				onClick={() => setIsOpen((prevState) => !prevState)}
			>
				<p className="pButtonName">{dropleftButtonName}</p>
			</button>
			{isOpen && (
				<div className="dropleftContent">
					<ul>
						{dropleftActions.map((dropleftAction) => (
							<li key={dropleftAction.name}>
								<button onClick={dropleftAction.onClick}>
									{dropleftAction.name}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default DropleftMenu;
