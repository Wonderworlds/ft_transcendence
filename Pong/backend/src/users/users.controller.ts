import {
  BadRequestException,
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
import {
  UserDto,
  MatchDto,
  SecureUserDto,
  UserDtoEmail,
  UserDtoPPImg,
  UserDtoPseudo,
  UserDtoStatus,
  UserDtoTwoFA,
  UserDtoUsername,
  LimitedUserDto,
  UserDtoPassword,
} from 'src/utils/dtos';
import { myDebug } from 'src/utils/DEBUG';
import { validate } from 'class-validator';

@Controller({ path: 'users' })
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/match')
  async createMatch(@Body() matchInfo: MatchDto) {
    console.log('creatematch');
    return await this.userService.createMatchDB(matchInfo);
  }

  @Get(':pseudo')
  async getUserByPseudo(
    @Param('pseudo') pseudo: string,
  ): Promise<LimitedUserDto> {
    const user = await this.userService.findUserByPseudo(pseudo);
    return this.userService.userToLimitedDto(user);
  }

  @Get()
  async getUser(@Req() req: any) {
    myDebug('getUser', req.user);
    const user = await this.userService.findUserById(req.user.userId);
    return this.userService.userToDto(user);
  }

  @Put('/email')
  async UpdateUserEmail(
    @Body() body: UserDtoEmail,
    @Req() req: any,
  ) {
    myDebug('UpdateUserEmail', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Put('/twoFA')
  async UpdateUserTwoFa(
    @Body() body: UserDtoTwoFA,
    @Req() req: any,
  ) {
    myDebug('UpdateUserTwoFa', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Put('/pseudo')
  async UpdateUserPseudo(
    @Body() body: UserDtoPseudo,
    @Req() req: any,
  ) {
    myDebug('UpdateUserPseudo', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Put('/password')
  async UpdateUserPassword(
    @Body() body: UserDtoPassword,
    @Req() req: any,
  ) {
    myDebug('UpdateUserPassword', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Put('/ppImg')
  async UpdateUserPPImg(
    @Body() body: UserDtoPPImg,
    @Req() req: any,
  ) {
    myDebug('UpdateUserPPImg', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Put('/status')
  async UpdateUserStatus(
    @Body() body: UserDtoStatus,
    @Req() req: any,
  ) {
    myDebug('UpdateUserStatus', req.user, body);
    return this.userService.updateUserById(req.user.userId, body);
  }

  @Get(':pseudo/matchs')
  async getMatchHistoryByUser(@Param('pseudo') pseudo: string) {
    return await this.userService.getMatchHistory(pseudo);
  }
}
