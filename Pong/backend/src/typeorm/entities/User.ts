import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./Room";
import { Match } from "./Match";
import { LadderType } from "src/utils/types";

@Entity({ name: 'users'})
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	
	@Column({ unique: true})
	username: string;

	@Column({ unique: true})
	pseudo: string;

	@Column()
	ppImg: string;

	@Column({nullable: true})
	password: string;

	@Column({nullable: true})
	authStrategy: string;

	@Column({default: LadderType.bronze})
	rank: LadderType;

	@OneToMany(() => Room, (room: Room) => room.owner)
	owners: Room[];

	@ManyToMany(() => Room, (room: Room) => room.admins)
	admins: Promise<Room>[];

	@ManyToMany(() => Room, (room: Room) => room.users)
	rooms: Promise<Room>[];

	@OneToMany(() => Match, (match: Match) => match.players)
	matchs: Promise<Match>[];
}