import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {

	constructor(private userService:UsersService) {}
	@Get()
	async getUsers() {
		const users =  await this.userService.findUsers();
		console.log("get User", users);
		return users;

	}

	@Post()
	async createUser(
		@Body() createUserDto: CreateUserDto)
	{
		const { confirmPassword, ...userDetails} = createUserDto;
		console.log("create User");
		return await this.userService.createUser(userDetails);
	}

	@Put(':id')
	async updateUserById(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateUserDto: UpdateUserDto)
	{
		await this.userService.updateUser(id, updateUserDto);
	}

	@Delete(':id')
	async deleteUserById(
		@Param('id', ParseIntPipe) id: number)
	{
		await this.userService.deleteUser(id);
	}

	@Post(':id/profiles')
	async createUserProfile(
			@Param('id', ParseIntPipe) id: number,
			@Body() createUserProfileDto: CreateUserProfileDto)
	{
		return await this.userService.createUserProfile(id, createUserProfileDto);
	}

	@Post(':id/posts')
	async createUserPost(
			@Param('id', ParseIntPipe) id: number,
			@Body() createUserPostDto: CreateUserPostDto)
	{
		return await this.userService.createUserPost(id, createUserPostDto);
	}
}
