import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, UserDto } from 'src/utils/dtos';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService : AuthService) {};

	@HttpCode(HttpStatus.OK)
	@Post('/login')
	logIn(@Body() secureUser: LogInUserDto)
	{
		try {
			return this.authService.onLoginLogic(secureUser);
		} catch (error: any) {
			return new BadRequestException('LogIn Failed', error);
		}
	}

	@Get()
	isLoggedIn(@Session() session: Record<string, any>) : Promise<UserDto> | undefined
	{
		console.info(session);
		return ;
	}
}
