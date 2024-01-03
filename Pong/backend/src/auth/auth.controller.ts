import { BadRequestException, Body, Controller, Get, Post, Req, Request, Session, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, UserDto } from 'src/utils/dtos';
import { LocalAuthGuard } from './local.auth.guard';
import { JwtAuthGuard } from './jwt.auth.guard';
import { SkipAuth } from './constants';

@Controller('auth')
export class AuthController {
	constructor(private authService : AuthService) {};

	@SkipAuth()
	@Post('/signup')
	signUp(@Body() secureUser: LogInUserDto)
	{
			secureUser.username = secureUser.username.toLowerCase();
			return this.authService.createUser(secureUser);
	}

	@SkipAuth()
	@UseGuards(LocalAuthGuard)
	@Post('/login')
	logIn(@Req() req: any)
	{
		return this.authService.login(req.user);
	}

	@Get()
	isLoggedIn(@Session() session: Record<string, any>) : Promise<UserDto> | undefined
	{
		console.info(session);
		return ;
	}

	@UseGuards(JwtAuthGuard)
	@Get('user')
	getUser(@Req() req: any)
	{
		console.info(req.user);
		return req.user;
	}

	@UseGuards(JwtAuthGuard)
	@Post('user')
	PostUser(@Req() req: any, @Body() body: any)
	{
		console.info(req.user);
		console.info(body);
		return body;
	}
}
