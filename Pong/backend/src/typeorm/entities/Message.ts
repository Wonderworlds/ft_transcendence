import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Room } from "./Room";

@Entity({ name: 'message' })
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sender: string;

	@Column()
	body: string;

	@Column({default: new Date()})
	createdAt: Date;

	@OneToMany(() => Room, (room: Room) => room.msgs)
	room: Room;
}