import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_profiles' })
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true})
	firstname: string;

	@Column()
	lastname: string;

	@Column()
	age: number;

	@Column()
	dob: string;

	@Column({ default: new Date() })
	createdAt: Date;
}