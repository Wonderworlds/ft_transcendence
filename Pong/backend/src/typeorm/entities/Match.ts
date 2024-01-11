import { GameType } from "src/utils/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'match' })
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user: User) => user.wins)
	@JoinColumn()
	winner: User;

	@ManyToOne(() => User, (user: User) => user.loses)
	@JoinColumn()
	loser: User;

	@Column()
	p1: string;

	@Column()
	p2: string;

	@Column()
	scoreP1: number;

	@Column()
	scoreP2: number;

	@Column()
	gameType: GameType;
	
	@Column({default: new Date()})
	createdAt: Date;
}