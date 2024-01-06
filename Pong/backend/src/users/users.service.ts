import { BadRequestException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import { of } from 'rxjs';
import { LimitedUserDto, MatchDto, SecureUserDto, UserDto, UserDtoEmail, UserDtoPPImg, UserDtoPassword, UserDtoPseudo, UserDtoStatus, UserDtoTwoFA } from 'shared/src/Dtos';
import { Match } from 'src/typeorm/entities/Match';
import { User } from 'src/typeorm/entities/User';
import { myDebug } from 'src/utils/DEBUG';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Match) private matchRepository: Repository<Match>,
  ) {}

  async createUserDB(user: SecureUserDto): Promise<User> {
    const newUser = this.userRepository.create({
      ...user,
    });
    myDebug('createUserDB', newUser);
    return await this.userRepository.save(newUser);
  }

  async findUserByPseudo(pseudo: string): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ pseudo: pseudo });
    return user;
  }

  async findUserByUsername(username: string): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ username: username });
    return user;
  }

  async findUserById(id: number): Promise<User> | undefined {
    const user = await this.userRepository.findOneBy({ id: id });
    return user;
  }

  async updateUserById(
    id: number,
    user:
      | UserDtoEmail
      | UserDtoTwoFA
      | UserDtoPseudo
      | UserDtoPPImg
      | UserDtoStatus
      | UserDtoPassword,
  ) {
    const res = await this.userRepository.update({ id }, { ...user });
    return res;
  }

  async updateUserByUsername(
    username: string,
    user:
      | UserDtoEmail
      | UserDtoTwoFA
      | UserDtoPseudo
      | UserDtoPPImg
      | UserDtoStatus
      | UserDtoPassword,
  ) {
    const res = await this.userRepository.update({ username }, { ...user });
    return res;
  }

  async getPPImg(id: number, @Res() res) {
    const user = await this.findUserById(id);
    if (!user)
      throw new BadRequestException("Img not Found");
    return of(res.sendFile(join(process.cwd(), 'shared/', user.ppImg)));

  }

  async getMatchHistory(pseudo: string): Promise<Array<Match>> | undefined {
    const user = await this.userRepository.findOne({
      where: { pseudo: pseudo },
      relations: ['wins', 'loses'],
    });
    if (user) {
      Array.prototype.push.apply(user.wins, user.loses);
      return user.wins;
    } else return;
  }

  async createMatchDB(matchInfo: MatchDto) {
    const p1 = await this.findUserByPseudo(matchInfo.P1);
    if (!p1) return;
    const p2 = await this.findUserByPseudo(matchInfo.P2);
    if (!p2) return;
    const newMatch = this.matchRepository.create({
      ...matchInfo,
      winner: matchInfo.scoreP1 > matchInfo.scoreP2 ? p1 : p2,
      loser: matchInfo.scoreP1 > matchInfo.scoreP2 ? p2 : p1,
    });
    return await this.matchRepository.save(newMatch);
  }

  userToDto(user: User): UserDto {
    const newUser: UserDto = {
      username: user.username,
      pseudo: user.pseudo,
      ppImg: user.ppImg,
      status: user.status,
      email: user.email,
      twoFA: user.twoFA,
    };
    return newUser;
  }

  userToLimitedDto(user: User): LimitedUserDto {
    const newUser: LimitedUserDto = {
      pseudo: user.pseudo,
      ppImg: user.ppImg,
      status: user.status,
    };
    return newUser;
  }
}
