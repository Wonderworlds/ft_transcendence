import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/typeorm/entities/Match';
import { User } from 'src/typeorm/entities/User';
import { UserDto, MatchDto } from 'src/utils/dtos';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  findUsers(username: string) {
    return this.userRepository.find({ relations: ['wins', 'loses'] });
  }

  async createUserDB(user: UserDto) {
    const newUser = this.userRepository.create({
      ...user,
    });
    return await this.userRepository.save(newUser);
  }

  async findUserByUsername(username: string): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ username: username });
    return user;
  }

  async updateUser(username: string, user: UserDto) {
    return await this.userRepository.update({ username }, { ...user });
  }

  async getMatchHistory(username: string): Promise<Array<Match>> | undefined {
    const user = await this.userRepository.findOne({
      where: { username: username },
      relations: ['wins', 'loses'],
    });
    if (user) {
      Array.prototype.push.apply(user.wins, user.loses);
      return user.wins;
    } else return;
  }

  async createMatchDB(matchInfo: MatchDto) {
    const p1 = await this.findUserByUsername(matchInfo.P1);
	if (!p1)
		return ;
    const p2 = await this.findUserByUsername(matchInfo.P2);
    if (!p2)
		return ;
	const newMatch = this.matchRepository.create({
		...matchInfo,
		winner: matchInfo.scoreP1 > matchInfo.scoreP2 ? p1 : p2,
		loser: matchInfo.scoreP1 > matchInfo.scoreP2 ? p2 : p1,
	  });
    return await this.matchRepository.save(newMatch);
  }
}
