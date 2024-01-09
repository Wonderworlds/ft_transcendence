import React from 'react';

const LobbysList: React.FC = () => {
	return (
		<div className="headerLobbysList">
			<div className="divToFriend">
				{/* <Link to="/Chat"><h1 className='friends'>friends</h1></Link> */}
			</div>
			<div className="divTitleLobbys">
				<h1>lobbys</h1>
			</div>
			<div className="divDisplayLobbys">
				<p>name lobby</p>
				<p>name lobby</p>
				<p>name lobby</p>
				<p>name lobby</p>
			</div>
			<div className="divAddLobbys">
				<div className="divIdLobbys">
					<div className="divId">
						<p>name</p>
					</div>
					<div className="divInputNameLobby">
						<input type="text" id="idLobby" name="idLobby" className="name" />
					</div>
				</div>
				<div className="divPswLobbys">
					<div className="divPsw">
						<p>password</p>
					</div>
					<div className="divInputPswLobby">
						<input type="text" id="pswLobby" name="pswLobby" className="psw" />
					</div>
				</div>
				<div className="divSendLobbys">
					<button>add lobbys</button>
				</div>
			</div>
		</div>
	);
};

export default LobbysList;
