import { Column, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Room } from "./Room";

@Entity({ name: 'match' })
export class Match {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToMany(() => User, (user: User) => user.matchs)
	players: Promise<User>[];

	@Column()
	scoreP1: number;

	@Column()
	scoreP2: number;

	@Column({default: new Date()})
	createdAt: Date;
}