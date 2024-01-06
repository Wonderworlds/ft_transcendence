import { Status } from "shared/src/types";
import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "./Match";
import { Message } from "./Message";
import { Otp } from "./Otp";
import { Room } from "./Room";

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

	@Column({default: 'pp_default.png'})
	ppImg: string;

	@Column({default: false})
	twoFA: boolean;

	@Column({nullable: true})
	email: string;

	@OneToOne(() => Otp)
	@JoinColumn()
	otp: Otp;
	
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