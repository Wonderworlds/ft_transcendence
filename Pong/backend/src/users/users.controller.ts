import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { myDebug } from 'src/utils/DEBUG';
import { LimitedUserDto, MatchDto } from 'src/utils/Dtos';
import { UsersService } from './users.service';

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
    if (!user) throw new BadRequestException('User not found');
    return this.userService.userToLimitedDto(user);
  }

  @Get(':pseudo/matchs')
  async getMatchHistoryByUser(@Param('pseudo') pseudo: string) {
    myDebug('getMatchHistoryByUser', pseudo);
    return await this.userService.getMatchHistory(pseudo);
  }
}
