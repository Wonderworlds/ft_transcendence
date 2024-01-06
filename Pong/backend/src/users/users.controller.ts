import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { UsersService } from './users.service';
import { MatchDto, LimitedUserDto } from 'src/utils/Dtos';

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

  @Get(':pseudo/matchs')
  async getMatchHistoryByUser(@Param('pseudo') pseudo: string) {
    return await this.userService.getMatchHistory(pseudo);
  }
}
