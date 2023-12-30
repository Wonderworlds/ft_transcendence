import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/utils/dtos';

@Controller('users')
export class UsersController {
	constructor(private userService:UsersService) {};

	@Post()
	async createUser(@Body() newUser: UserDto) {
		return await this.userService.createUserDB(newUser);
	}

	@Get(':username')
	async getUserByUsername(@Param('username') username: string) {
		return await this.userService.findUserByUsername(username);
	}

	@Put(':username')
	async UpdateUserbyUsername(@Param('username') username: string, @Body() user: UserDto) {
		console.info(user);	
		return this.userService.updateUser(username, user);
	}}
