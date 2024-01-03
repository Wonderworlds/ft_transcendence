import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { Match } from "./Match";
import { Message } from "./Message";
import { Status } from "src/utils/types";

@Entity({ name: 'users'})
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column({ unique: true})
	username: string;
	
	@Column()
	password: string;

	@Column({ unique: true})
	pseudo: string;

	@Column()
	ppImg: string;

	@Column({default: false})
	twoFA: boolean;

	@Column({default: 0})
	rank: Number;

	@Column({default: Status.Online})
	status: Status;

	@ManyToMany(() => User, (user: User) => user.friends)
	friends: Promise<User>[];

	@ManyToMany(() => User, (user: User) => user.blockedBy)
	blocked: Promise<User>[];
	
	@ManyToMany(() => User, (user: User) => user.blocked)
	blockedBy: Promise<User>[];

	@OneToMany(() => Message, (msg: Message) => msg.sender)
	msgs: Room[];

	@OneToMany(() => Room, (room: Room) => room.owner)
	owners: Room[];

	@ManyToMany(() => Room, (room: Room) => room.admins)
	admins: Promise<Room>[];

	@ManyToMany(() => Room, (room: Room) => room.users)
	rooms: Promise<Room>[];

	@OneToMany(() => Match, (match: Match) => match.winner)
	wins: Match[]

	@OneToMany(() => Match, (match: Match) => match.loser)
	loses: Match[]
}