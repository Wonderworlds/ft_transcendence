import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'otp' })
export class Otp {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => User)
	@JoinColumn()
	owner: User;

	@Column()
	ownerId: number;

	@Column()
	code: string;

    @Column({default: new Date()})
	createdAt: Date;

	@Column()
	expiresAt: Date;
}