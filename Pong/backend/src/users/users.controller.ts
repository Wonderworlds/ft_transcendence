import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, MatchDto, SecureUserDto } from 'src/utils/dtos';

@Controller({path: 'users'})
export class UsersController {
	constructor(private userService:UsersService) {};

	@Post()
	async createUser(@Body() newUser: SecureUserDto) {
		return await this.userService.createUserDB(newUser);
	}

	@Post('/match')
	async createMatch(@Body() matchInfo: MatchDto) {
		console.log("creatematch");
		return await this.userService.createMatchDB(matchInfo);
	}

	@Get(':pseudo')
	async getUserByPseudo(@Param('pseudo') pseudo: string) {
		return await this.userService.findUserByPseudo(pseudo);
	}

	@Get(':username')
	async getUserByUsername(@Param('username') username: string) {
		console.info('getUserByUsername');	
		return await this.userService.findUserByUsername(username);
	}

	@Put(':username')
	async UpdateUserbyUsername(@Param('username') username: string, @Body() user: UserDto) {
		console.info('UpdateUserbyUsername');	
		return this.userService.updateUser(username, user);
	}

	@Get(':pseudo/matchs')
	async getMatchHistoryByUser(@Param('pseudo') pseudo: string) {
		return await this.userService.getMatchHistory(pseudo);
	}

}

