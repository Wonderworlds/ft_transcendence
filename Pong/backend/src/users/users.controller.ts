import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto, MatchDto, SecureUserDto } from 'src/utils/dtos';
import { AuthGuard } from '@nestjs/passport';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() newUser: SecureUserDto) {
    return await this.userService.createUserDB(newUser);
  }

  @Post('/match')
  async createMatch(@Body() matchInfo: MatchDto) {
    console.log('creatematch');
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
  async UpdateUserbyUsername(
    @Param('username') username: string,
    @Body() user: UserDto,
	@Req() req:any
  ) {

    console.info('UpdateUserbyUsername');
    console.info(req.user);
    return this.userService.updateUser(username, user);
  }

  
  @Put(':username/email')
  async UpdateUserbyUsernameEmail(
    @Param('username') username: string,
    @Body() body: {email: string},
	@Req() req:any
  ) {

    console.info('UpdateUserbyUsername');
    console.info(req.user);
    return this.userService.updateUser(username, body);
  }

  @Get(':pseudo/matchs')
  async getMatchHistoryByUser(@Param('pseudo') pseudo: string) {
    return await this.userService.getMatchHistory(pseudo);
  }

  @HttpCode(200)
  @Post('email/verify')
  verifyPhone(@Req() request: any) {
	console.info(request.user);
    return this.userService.verifyPhone(request);
  }
}
