import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./Message";
import { User } from "./User";
import { roomProtection } from "src/utils/types";

@Entity({ name: 'room' })
export class Room {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => User, (user: User) => user.owners)
	owner: User;

	@ManyToMany(() => User, (user: User) => user.admins)
	admins: Promise<User>[];

	@Column({default: roomProtection.public})
	protection: roomProtection;

	@Column({nullable: true})
	password: string;

	@Column({default: new Date()})
	lastModified: Date;

	@ManyToMany(() => User, (user: User) => user.rooms)
	users: Promise<User>[];

	@ManyToOne(() => Message, (msg: Message) => msg.room)
	msgs: Message[];
}