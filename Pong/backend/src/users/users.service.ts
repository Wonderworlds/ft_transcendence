import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { UserDto } from 'src/utils/dtos';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}
	
	async createUserDB(user: UserDto) {
		const newUser = this.userRepository.create({
			...user
		});
		return await this.userRepository.save(newUser);
	}

	async findUserByUsername(username: string) : Promise<User> | undefined {
		const user = await this.userRepository.findOneBy({ username });
		return user;
	}

	async updateUser(username: string, user: UserDto) {
		return await this.userRepository.update({ username }, { ...user});
	}

}
