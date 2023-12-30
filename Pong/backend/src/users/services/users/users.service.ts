import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams, UserPostParams, UserProfileParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
	) {}

	
}
