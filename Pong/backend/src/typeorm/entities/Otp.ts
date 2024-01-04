import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'otp' })
export class Otp {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToMany(() => User, (user: User) => user.otps)
	owner: User;

	@Column()
	code: string;

    @Column({default: new Date()})
	createdAt: Date;

	@UpdateDateColumn({default: new Date()})
	updatedAt: Date;

	@Column()
	expiresAt: Date;

}