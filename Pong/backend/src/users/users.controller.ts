import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, MatchDto } from 'src/utils/dtos';

@Controller('users')
export class UsersController {
	constructor(private userService:UsersService) {};

	@Post()
	async createUser(@Body() newUser: UserDto) {
		return await this.userService.createUserDB(newUser);
	}

	@Post('/match')
	async createMatch(@Body() matchInfo: MatchDto) {
		console.log("creatematch");
		return await this.userService.createMatchDB(matchInfo);
	}

	@Get(':username')
	async getUserByUsername(@Param('username') username: string) {
		return await this.userService.findUserByUsername(username);
	}

	@Put(':username')
	async UpdateUserbyUsername(@Param('username') username: string, @Body() user: UserDto) {
		console.info(user);	
		return this.userService.updateUser(username, user);
	}

	@Get(':username/matchs')
	async getMatchHistoryByUser(@Param('username') username: string) {
		const res = await this.userService.getMatchHistory(username);
		return res;
	}
}

