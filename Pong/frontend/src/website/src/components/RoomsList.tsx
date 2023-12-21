import React from 'react'
import { Link, useLocation } from 'react-router-dom';

const RoomsList: React.FC = () => {
	return (
		<div className="divRoomsList">
			<div className="divToFriend">
				<Link to="/Chat"><h1 className='friends'>friends</h1></Link>
			</div>
			<div className="divTitleRooms">
				<h1>rooms</h1>
			</div>
			<div className="divDisplayRooms">
				<p>name room</p>
				<p>name room</p>
				<p>name room</p>
				<p>name room</p>
			</div>
			<div className="divAddRooms">
				<div className="divIdRooms">
					<div className="divId">
						<p>name</p>
					</div>
					<div className="divInputNameRoom">
						<input type="text" id="idRoom" name="idRoom" className="name"/>
					</div>
				</div>
				<div className="divPswRooms">
					<div className="divPsw">
						<p>password</p>
					</div>
					<div className="divInputPswRoom">
						<input type="text" id="pswRoom" name="pswRoom" className="psw"/>
					</div>
				</div>
				<div className="divSendRooms">
					<button>add rooms</button>
				</div>
			</div>
		</div>
	);
};

export default RoomsList;