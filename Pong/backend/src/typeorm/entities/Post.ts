import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: 'user_posts' })
export class Post {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	title:string;

	@Column()
	description: string;

	@Column({default: new Date()})
	createdAt: Date;

	@ManyToOne(() => User, (user) => user.posts)
	@JoinColumn()
	user: User;
}