import React from 'react';

const MenuFriend: React.FC = () => {
	return (
		<div className="HeaderMenuFriend">
			<div className="divTitleFriendChat">
				<h1>friends</h1>
			</div>
			<div className="divListFriend">
				<p>player</p>
				<p>player</p>
				<p>player</p>
				<p>player</p>
				<p>player</p>
				<p>player</p>
			</div>
			<div className="divAddFriend">
				<div className="divTitleAddFriend">
					<button>add</button>
				</div>
				<div className="divInputAddFriend">
					<input type="text" id="searchFriend" name="searchFriend" />
				</div>
			</div>
			<div className="divChangePageServer">
				{/* <Link to="/Lobbys">
					<h1 className="disconnectText">lobbys</h1>
				</Link> */}
			</div>
		</div>
	);
};

export default MenuFriend;
