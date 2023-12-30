import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
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
	P1: string;

	@Column()
	P2: string;

	@Column()
	scoreP1: number;

	@Column()
	scoreP2: number;

	@Column({default: new Date()})
	createdAt: Date;
}