import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams, UserPostParams, UserProfileParams } from 'src/users/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		@InjectRepository(Profile) private profileRepository: Repository<Profile>,
		@InjectRepository(Post) private postRepository: Repository<Post>
	) {}

	findUsers() {
		return this.userRepository.find({ relations: ['profile', 'posts']});
	}

	createUser(userDetails: CreateUserParams) {
		const newUser = this.userRepository.create({
			...userDetails,
			createAt: new Date()
		});
		return this.userRepository.save(newUser);
	}

	updateUser(id:number, updateUserDetails: UpdateUserParams) {
		return this.userRepository.update({ id }, { ...updateUserDetails});
	}

	async findUserById(id: number) {
		const user = await this.userRepository.findOneBy({ id });
		return user;
	}

	deleteUser(id: number)
	{
		const user = this.findUserById(id);
		return user;
	}

	async createUserProfile(id:number, userProfileDetails: UserProfileParams)
	{
		const user = await this.findUserById(id);
		if (!user)
			throw new HttpException("User not found. Cannot create Profile", HttpStatus.BAD_REQUEST);
		else
		{
			const newProfile = this.profileRepository.create({
				...userProfileDetails,
				createdAt: new Date()
			});
			const savedProfile = await this.profileRepository.save(newProfile);
			user.profile = savedProfile;
			return this.userRepository.save(user);
		}
	}

	async createUserPost(id:number, userPostDetails: UserPostParams)
	{
		const user = await this.findUserById(id);
		if (!user)
			throw new HttpException("User not found. Cannot create Post", HttpStatus.BAD_REQUEST);
		else
		{
			const newPost = this.postRepository.create({
				...userPostDetails,
				user: user,
				createdAt: new Date()
			});
			const savedPost = await this.postRepository.save(newPost);
			return savedPost;
		}
	}
}
