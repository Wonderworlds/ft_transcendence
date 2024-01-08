import { Status } from "src/utils/types";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Match } from "./Match";
import { Otp } from "./Otp";

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
	
	@ManyToMany(() => User, {onDelete: 'CASCADE'})
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friends: User[];

	@ManyToMany(() => User, {onDelete: 'CASCADE'})
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friendsPending: User[];

	@ManyToMany(() => User, {onDelete: 'CASCADE'})
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	friendsDemands: User[];

	@ManyToMany(() => User, {onDelete: 'CASCADE'})
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	blocked: User[];

	@ManyToMany(() => User, {onDelete: 'CASCADE'})
	@JoinTable({ joinColumn: { name: 'users_id_1' } })
	blockedBy: User[];
	
	@OneToMany(() => Match, (match: Match) => match.winner)
	wins: Match[]

	@OneToMany(() => Match, (match: Match) => match.loser)
	loses: Match[]
}